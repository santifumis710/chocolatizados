/**
 * Hook personalizado: useCart
 * 
 * Maneja el carrito del cliente con persistencia en localStorage.
 * No necesita backend, todo se maneja en cliente.
 */

import { useState, useEffect } from "react";

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  allows_customization: boolean;
  customization_text?: string;
  image_url?: string;
  min_quantity?: number;
}

interface CartState {
  items: CartItem[];
  last_updated: string;
}

const STORAGE_KEY = "chocolatizados_cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar del localStorage al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CartState = JSON.parse(saved);
        setCart(parsed.items || []);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
    setLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambia
  const saveCart = (items: CartItem[]) => {
    try {
      const state: CartState = {
        items,
        last_updated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Agregar item al carrito
  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCart((prevCart) => {
      // Buscar si ya existe el producto
      const existingItem = prevCart.find((i) => i.product_id === item.product_id);

      let updated: CartItem[];

      if (existingItem) {
        // Aumentar cantidad si permite la misma personalización
        if (
          JSON.stringify(existingItem.customization_text) ===
          JSON.stringify(item.customization_text)
        ) {
          updated = prevCart.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        } else {
          // Agregar como item nuevo si tiene diferente personalización
          updated = [...prevCart, { ...item, quantity: item.quantity || 1 } as CartItem];
        }
      } else {
        // Agregar nuevo item
        updated = [...prevCart, { ...item, quantity: item.quantity || 1 } as CartItem];
      }

      saveCart(updated);
      return updated;
    });
  };

  // Eliminar item del carrito
  const removeItem = (product_id: number, customization?: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => {
        if (item.product_id !== product_id) return true;
        // Si el producto tiene personalización, comparar también eso
        if (customization !== undefined) {
          return item.customization_text !== customization;
        }
        return false;
      });
      saveCart(updated);
      return updated;
    });
  };

  // Actualizar cantidad
  const updateQuantity = (product_id: number, quantity: number, customization?: string) => {
    if (quantity <= 0) {
      removeItem(product_id, customization);
      return;
    }

    setCart((prevCart) => {
      const updated = prevCart.map((item) => {
        if (item.product_id === product_id) {
          if (customization !== undefined) {
            if (item.customization_text === customization) {
              return { ...item, quantity };
            }
          } else {
            return { ...item, quantity };
          }
        }
        return item;
      });
      saveCart(updated);
      return updated;
    });
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Contar cantidad de items
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loaded,
  };
};

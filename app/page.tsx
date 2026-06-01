"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Storefront } from "@/components/Storefront";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ProductDetail } from "@/components/ProductDetail";
import { useCart, CartItem } from "@/hooks/useCart";
import { createOrder, fetchProducts } from "@/services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  allows_customization: boolean;
  weight_g?: number;
  dimensions?: string;
  options?: string;
  min_quantity?: number;
  image_position?: string;
  is_visible?: boolean;
}

const WHATSAPP_PHONE = "5493424062442";

const buildWhatsAppMessage = (data: any, originalTotal: number) => {
  const itemsList = data.items
    .map((item: any) =>
      `- ${item.quantity}x ${item.name}${item.customization_text ? ` ${item.customization_text}` : ""}`
    )
    .join("\n\n");

  const wave = String.fromCodePoint(0x1f44b);
  const clipboard = String.fromCodePoint(0x1f4cb);
  const moneyBag = String.fromCodePoint(0x1f4b0);
  const bust = String.fromCodePoint(0x1f464);
  const tag = String.fromCodePoint(0x1f3f7);

  const discount = data.discount;
  const totalLine = discount
    ? `${tag} Descuento ${discount.code}: -$${discount.discount_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}\n` +
      `${moneyBag} Total: $${discount.final_total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
    : `${moneyBag} Total: $${originalTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;

  return (
    `Hola Chocolatizados! ${wave} Quiero realizar el siguiente pedido:\n\n` +
    `${clipboard} Detalle:\n\n` +
    `${itemsList}\n\n` +
    `${totalLine}\n\n` +
    `${bust} Nombre: ${data.customer_name}`
  );
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toastState, setToastState] = useState<"hidden" | "visible" | "closing">("hidden");

  const { cart, addItem, removeItem, updateQuantity, clearCart, itemCount, total } = useCart();

  useEffect(() => {
    fetchProducts()
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.is_visible !== false));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  const handleAddToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    addItem({ ...item, quantity });
    setToastState("visible");
    setTimeout(() => setToastState("closing"), 4500);
    setTimeout(() => setToastState("hidden"), 5000);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = async (data: any) => {
    const message = buildWhatsAppMessage(data, total);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;

    const finalTotal = data.discount ? data.discount.final_total : total;

    try {
      await createOrder({
        ...data,
        total: finalTotal,
        discount_code: data.discount?.code ?? null,
        discount_amount: data.discount?.discount_amount ?? null,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Hubo un error guardando el pedido, pero te redirigiremos a WhatsApp.");
    }

    window.location.href = whatsappUrl;
    clearCart();
    setCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      {toastState !== "hidden" && (
        <div className={`toast-notification ${toastState === "visible" ? "toast-entering" : "toast-exiting"}`}>
          <span>✅</span>
          Producto agregado al carrito
        </div>
      )}

      <Header itemCount={itemCount} onCartClick={() => setCartOpen(!cartOpen)} />

      <Hero />

      <CategoryShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Storefront
        products={products}
        loading={loading}
        selectedCategory={selectedCategory}
        onClearCategory={() => setSelectedCategory(null)}
        onSelectProduct={setSelectedProductId}
      />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {cartOpen && (
        <CartSidebar
          items={cart}
          total={total}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
          onClose={() => setCartOpen(false)}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          isOpen={true}
          items={cart}
          total={total}
          onClose={() => {
            setCheckoutOpen(false);
            setCartOpen(true);
          }}
          onSubmit={handleCheckoutComplete}
        />
      )}
    </div>
  );
}

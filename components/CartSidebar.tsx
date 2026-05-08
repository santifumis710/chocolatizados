"use client";

import React from "react";
import { CartItem } from "@/hooks/useCart";

interface CartSidebarProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onRemoveItem: (product_id: number, customization?: string) => void;
  onUpdateQuantity: (product_id: number, quantity: number, customization?: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  total,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}) => (
  <>
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 z-[999]"
    />

    <div className="fixed top-0 right-0 h-[100dvh] w-[400px] max-w-full bg-white shadow-lg z-[1000] flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="m-0 text-xl text-primary">Tu Carrito</h2>
        <button onClick={onClose} className="bg-transparent border-none text-2xl cursor-pointer text-text">
          ✕
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-textLight p-6">
            <div className="text-[40px] mb-4">🍫</div>
            <p>Tu carrito está vacío</p>
            <p className="text-sm">Agrega algunos chocolates deliciosos!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={`${item.product_id}-${item.customization_text || "default"}`}
              className="mb-6 pb-4 border-b border-border"
            >
              <div className="flex justify-between mb-2">
                <h4 className="m-0 text-base text-text">{item.name}</h4>
                <button
                  onClick={() => onRemoveItem(item.product_id, item.customization_text)}
                  className="bg-transparent border-none text-error cursor-pointer text-sm underline"
                >
                  Eliminar
                </button>
              </div>

              {item.customization_text && (
                <p className="my-0 mb-2 text-xs text-textLight italic p-2 bg-background rounded">
                  ✨ {item.customization_text}
                </p>
              )}

              <div className="flex justify-between items-center">
                <p className="my-0 mb-2 text-sm text-textLight">${item.price.toFixed(2)} c/u</p>
                {item.min_quantity && item.min_quantity > 1 && (
                  <span className="text-xs text-secondary font-bold">
                    (Min: {item.min_quantity})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const min = item.min_quantity || 1;
                    if (item.quantity - 1 < min) {
                      onRemoveItem(item.product_id, item.customization_text);
                    } else {
                      onUpdateQuantity(item.product_id, item.quantity - 1, item.customization_text);
                    }
                  }}
                  className="bg-background border border-border rounded w-[30px] h-[30px] cursor-pointer text-base"
                >
                  −
                </button>
                <span className="flex-1 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.product_id, item.quantity + 1, item.customization_text)
                  }
                  className="bg-background border border-border rounded w-[30px] h-[30px] cursor-pointer text-base"
                >
                  +
                </button>
                <span className="font-bold text-primary min-w-[80px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className="p-6 border-t border-border bg-background"
        style={{ paddingBottom: "calc(30px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-between mb-6 text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full p-4 text-white border-none rounded text-base font-bold transition-colors duration-300 disabled:bg-textLight disabled:cursor-not-allowed bg-primary cursor-pointer"
        >
          📲 Continuar por Whatsapp
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 p-4 bg-white text-primary border border-primary rounded text-base cursor-pointer transition-all duration-300"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  </>
);

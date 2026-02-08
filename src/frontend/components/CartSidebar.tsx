/**
 * Componente: CartSidebar
 * 
 * Panel deslizable con items del carrito, resumen y checkout
 */

"use client";

import React from "react";
import { CartItem } from "@/hooks/useCart";
import { colors, spacing, typography, shadows, borderRadius } from "@/theme";

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
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 999,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "400px",
          maxWidth: "100%",
          backgroundColor: colors.white,
          boxShadow: shadows.lg,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: typography.sizes.xl,
              color: colors.primary,
            }}
          >
            Tu Carrito
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: colors.text,
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div
          style={{
            flex: 1,
            padding: spacing.lg,
            overflowY: "auto",
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: colors.textLight,
                padding: spacing.lg,
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: spacing.md }}>🍫</div>
              <p>Tu carrito está vacío</p>
              <p style={{ fontSize: typography.sizes.sm }}>
                Agrega algunos chocolates deliciosos!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product_id}-${item.customization_text || "default"}`}
                style={{
                  marginBottom: spacing.lg,
                  paddingBottom: spacing.md,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                {/* Nombre */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: spacing.sm,
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: typography.sizes.base,
                      color: colors.text,
                    }}
                  >
                    {item.name}
                  </h4>
                  <button
                    onClick={() =>
                      onRemoveItem(item.product_id, item.customization_text)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: colors.error,
                      cursor: "pointer",
                      fontSize: typography.sizes.sm,
                      textDecoration: "underline",
                    }}
                  >
                    Eliminar
                  </button>
                </div>

                {/* Personalización */}
                {item.customization_text && (
                  <p
                    style={{
                      margin: `0 0 ${spacing.sm} 0`,
                      fontSize: typography.sizes.xs,
                      color: colors.textLight,
                      fontStyle: "italic",
                      padding: spacing.sm,
                      backgroundColor: colors.background,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    ✨ {item.customization_text}
                  </p>
                )}

                {/* Precio unitario */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p
                    style={{
                      margin: `0 0 ${spacing.sm} 0`,
                      fontSize: typography.sizes.sm,
                      color: colors.textLight,
                    }}
                  >
                    ${item.price.toFixed(2)} c/u
                  </p>
                  {item.min_quantity && item.min_quantity > 1 && (
                    <span style={{ fontSize: typography.sizes.xs, color: colors.secondary, fontWeight: 'bold' }}>
                      (Min: {item.min_quantity})
                    </span>
                  )}
                </div>

                {/* Cantidad */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <button
                    onClick={() => {
                      const min = item.min_quantity || 1;
                      if (item.quantity - 1 < min) {
                        onRemoveItem(item.product_id, item.customization_text);
                      } else {
                        onUpdateQuantity(
                          item.product_id,
                          item.quantity - 1,
                          item.customization_text
                        )
                      }
                    }}
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      fontSize: typography.sizes.base,
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(
                        item.product_id,
                        item.quantity + 1,
                        item.customization_text
                      )
                    }
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      fontSize: typography.sizes.base,
                    }}
                  >
                    +
                  </button>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: colors.primary,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing.lg,
            paddingBottom: "calc(20px + env(safe-area-inset-bottom))", // Ensure buttons are above Safari bar
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.background,
          }}
        >
          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: spacing.lg,
              fontSize: typography.sizes.lg,
              fontWeight: "bold",
            }}
          >
            <span>Total:</span>
            <span style={{ color: colors.primary }}>
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Botón Checkout */}
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            style={{
              width: "100%",
              padding: spacing.md,
              backgroundColor:
                items.length === 0 ? colors.textLight : colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: borderRadius.md,
              fontSize: typography.sizes.base,
              fontWeight: "bold",
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            📲 Continuar al checkout
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: spacing.md,
              padding: spacing.md,
              backgroundColor: colors.white,
              color: colors.primary,
              border: `1px solid ${colors.primary}`,
              borderRadius: borderRadius.md,
              fontSize: typography.sizes.base,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </>
  );
};

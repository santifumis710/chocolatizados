/**
 * Componente: CartWidget
 * 
 * Ícono/badge del carrito que aparece en la navegación
 * Muestra cantidad de items en el carrito
 */

"use client";

import React from "react";
import { colors, spacing } from "@/theme";

interface CartWidgetProps {
  itemCount: number;
  onClick: () => void;
}

export const CartWidget: React.FC<CartWidgetProps> = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
        padding: spacing.xs,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s ease",
        marginTop: "2px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      aria-label={`Carrito de compras con ${itemCount} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>

      {/* Badge con cantidad */}
      {itemCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: colors.primary,
            color: colors.white,
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </div>
      )}
    </button>
  );
};

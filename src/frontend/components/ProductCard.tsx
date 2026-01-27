/**
 * Componente: ProductCard
 * 
 * Tarjeta simple que muestra el nombre del producto
 * Al hacer clic, abre el panel de detalles
 */

"use client";

import React from "react";
import { colors, spacing, shadows, typography, borderRadius } from "@/theme";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  onSelect: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image_url,
  onSelect,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        width: "100%",
        padding: spacing.lg,
        backgroundColor: colors.white,
        border: `2px solid ${colors.secondary}`,
        borderRadius: borderRadius.lg,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: shadows.sm,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.background;
        e.currentTarget.style.boxShadow = shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.white;
        e.currentTarget.style.boxShadow = shadows.sm;
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: "100%",
          height: "200px",
          marginBottom: spacing.md,
          backgroundColor: "#f0f0f0",
          borderRadius: borderRadius.md,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {!imgError && image_url ? (
          <img
            src={image_url}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: "48px" }}>🍫</span>
        )}
      </div>

      <h3
        style={{
          margin: `0 0 ${spacing.sm} 0`,
          fontSize: typography.sizes.lg,
          color: colors.primary,
          fontWeight: "900",
          fontFamily: typography.fontFamily,
        }}
      >
        {name}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: typography.sizes.base,
          color: colors.textLight,
          fontFamily: typography.fontFamily, // Usamos la fuente Body (Lato)
        }}
      >
        ${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </p>
    </button>
  );
};

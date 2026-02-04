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
  imagePosition?: string;
  onSelect: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image_url,
  imagePosition,
  onSelect,
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        width: "100%",
        padding: 0, // Remove padding to let image fill the card
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
        overflow: "hidden", // Ensure image stays within border radius
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.white; // Keep white background
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.white;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = shadows.sm;
      }}
    >
      {/* Product Image - Full Width/Bleed */}
      <div
        style={{
          width: "100%",
          height: "200px", // Fixed height for consistency, or use aspect-ratio
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${colors.border}`, // Optional separator
        }}
      >
        {!imgError && image_url ? (
          <img
            src={image_url}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: imagePosition || "center center"
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: "48px" }}>🍫</span>
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: spacing.md, width: "100%" }}>
        <h3
          style={{
            margin: `0 0 ${spacing.sm} 0`,
            fontSize: typography.sizes.lg,
            color: colors.primary,
            fontWeight: "900",
            fontFamily: typography.fontFamily,
          }}
        >
          {name.split(/(\(.*?\))/).map((part, index) =>
            part.startsWith("(") && part.endsWith(")") ? (
              <span key={index} style={{ whiteSpace: "nowrap" }}>{part}</span>
            ) : (
              part
            )
          )}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: typography.sizes.base,
            color: colors.textLight,
            fontFamily: typography.fontFamily,
          }}
        >
          ${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>
    </button>
  );
};

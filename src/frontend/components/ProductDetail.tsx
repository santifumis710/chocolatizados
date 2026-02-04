/**
 * Componente: ProductDetail
 * 
 * Panel deslizable a la izquierda con detalles del producto
 * Permite seleccionar cantidad, sabor y personalizacion
 */

"use client";

import React, { useState } from "react";
import { CartItem } from "@/hooks/useCart";
import { colors, spacing, typography, shadows, borderRadius } from "@/theme";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  options?: string;
  allows_customization: boolean;
  min_quantity?: number;
  image_url?: string;
}

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [notes, setNotes] = useState("");
  if (!product) return null;

  // Actualizar cantidad mínima
  React.useEffect(() => {
    if (product) {
      setQuantity(product.min_quantity || 1);
      setSelectedOption(""); // Reset option on new product
    }
  }, [product]);

  // Parsear opciones
  const optionsList = product.options
    ? product.options.split(",").map((opt) => {
      const parts = opt.trim().split("|");
      return {
        name: parts[0],
        price: parseFloat(parts[1] || "0"),
      };
    })
    : [];

  // Inicializar precio y opción por defecto
  React.useEffect(() => {
    if (optionsList.length > 0 && !selectedOption) {
      setSelectedOption(optionsList[0].name);
      setSelectedPrice(optionsList[0].price);
    } else if (optionsList.length === 0) {
      setSelectedPrice(product.price);
    }
  }, [product, optionsList, selectedOption]);

  const handleAddToCart = () => {
    onAddToCart(
      {
        product_id: product.id,
        name: product.name,
        price: selectedPrice,
        allows_customization: product.allows_customization,
        customization_text: notes || undefined,
        image_url: undefined, // No guardamos imagen especifica ya que no se muestra en detalle
        min_quantity: product.min_quantity || 1,
      },
      quantity
    );
    onClose();
  };

  const minQty = product.min_quantity || 1;

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
      {/* ... (rest of layout unchanged until logic) ... */}


      {/* Panel deslizable */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "450px",
          maxWidth: "100%",
          backgroundColor: colors.white,
          boxShadow: shadows.lg,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header (Text Only) */}
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.background, // Contrast for header
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: typography.sizes.xl,
              color: colors.primary,
              fontFamily: typography.fontFamily,
              fontWeight: "900",
            }}
          >
            {product.name}
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

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: spacing.lg,
            overflowY: "auto",
          }}
        >
          {/* Cantidad */}
          <div
            style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <label
                style={{
                  display: "block",
                  fontSize: typography.sizes.sm,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                📊 Cantidad:
              </label>
              {minQty > 1 && (
                <span style={{ fontSize: typography.sizes.xs, color: colors.secondary, fontWeight: 'bold' }}>
                  (Mínimo {minQty} unidades)
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                disabled={quantity <= minQty}
                style={{
                  backgroundColor: quantity <= minQty ? "#eee" : colors.background,
                  color: quantity <= minQty ? "#aaa" : colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.md,
                  width: "40px",
                  height: "40px",
                  cursor: quantity <= minQty ? "not-allowed" : "pointer",
                  fontSize: typography.sizes.lg,
                  fontWeight: "bold",
                }}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                style={{
                  flex: 1,
                  padding: spacing.sm,
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.sizes.base,
                  textAlign: "center",
                }}

              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.md,
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  fontSize: typography.sizes.lg,
                  fontWeight: "bold",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Notas y personalizacion */}
          <div
            style={{
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: spacing.sm,
                fontSize: typography.sizes.sm,
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              ✨ Notas especiales (tipo de chocolate, personalizacion, etc):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe tus especificaciones..."
              maxLength={500}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: spacing.sm,
                border: `1px solid ${colors.secondary}`,
                borderRadius: borderRadius.md,
                fontFamily: typography.fontFamily,
                fontSize: typography.sizes.sm,
                boxSizing: "border-box",
              }}
            />
            <p
              style={{
                margin: `${spacing.xs} 0 0 0`,
                fontSize: typography.sizes.xs,
                color: colors.textLight,
              }}
            >
              {notes.length}/500 caracteres
            </p>
          </div>

          {/* Precio total */}
          <div
            style={{
              padding: spacing.md,
              backgroundColor: colors.background,
              borderRadius: borderRadius.md,
              marginBottom: spacing.lg,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: typography.sizes.lg,
                fontWeight: "bold",
              }}
            >
              <span>Subtotal:</span>
              <span style={{ color: colors.primary }}>
                ${(selectedPrice * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer - Botón Agregar */}
        <div
          style={{
            padding: spacing.lg,
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.background,
          }}
        >
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              padding: spacing.md,
              backgroundColor: colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: borderRadius.md,
              fontSize: typography.sizes.base,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            🛒 Agregar al carrito
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
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
};

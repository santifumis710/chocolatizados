"use client";

import { ProductCard } from "@/components/ProductCard";
import { colors, spacing, typography } from "@/theme";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  image_position?: string;
}

interface StorefrontProps {
  products: Product[];
  loading: boolean;
  selectedCategory: string | null;
  onClearCategory: () => void;
  onSelectProduct: (id: number) => void;
}

export const Storefront = ({
  products,
  loading,
  selectedCategory,
  onClearCategory,
  onSelectProduct,
}: StorefrontProps) => {
  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <main className="main-content">
      <div style={{ marginBottom: spacing.lg }}>
        <h2 style={{ color: colors.primary, fontSize: typography.sizes.xl, fontWeight: 900 }}>
          {selectedCategory ? `Catálogo: ${selectedCategory}` : "Catálogo Completo"}
        </h2>
        {selectedCategory && (
          <button
            onClick={onClearCategory}
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: `1px solid ${colors.primary}`,
              color: colors.primary,
              borderRadius: "20px",
              cursor: "pointer",
              marginTop: spacing.sm,
            }}
          >
            ← Ver todos
          </button>
        )}
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: spacing.xl,
            fontSize: typography.sizes.lg,
            color: colors.textLight,
          }}
        >
          Cargando productos...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: spacing.xl,
            fontSize: typography.sizes.lg,
            color: colors.textLight,
          }}
        >
          No hay productos disponibles en esta categoría.
        </div>
      ) : (
        <div className="product-grid" style={{ display: "grid" }}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
              imagePosition={product.image_position}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </main>
  );
};

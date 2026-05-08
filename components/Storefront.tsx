"use client";

import { ProductCard } from "@/components/ProductCard";

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
      <div className="mb-6">
        <h2 className="text-primary text-xl font-black">
          {selectedCategory ? `Catálogo: ${selectedCategory}` : "Catálogo Completo"}
        </h2>
        {selectedCategory && (
          <button
            onClick={onClearCategory}
            className="mt-2 px-4 py-2 bg-transparent border border-primary text-primary rounded-full cursor-pointer"
          >
            ← Ver todos
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center p-8 text-lg text-textLight">Cargando productos...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-8 text-lg text-textLight">
          No hay productos disponibles en esta categoría.
        </div>
      ) : (
        <div className="product-grid grid">
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

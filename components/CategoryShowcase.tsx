"use client";

import React, { useEffect, useState } from "react";
import { fetchCategories } from "@/services/api";

export interface ProductType {
  id: string;
  title: string;
  weight: string;
  size: string;
  images: {
    semi: string;
    white: string;
    milk: string;
  };
}

interface CategoryShowcaseProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

type Flavor = "semi" | "white" | "milk";

const FLAVOR_SWATCH: Record<Flavor, string> = {
  semi: "#4A3728",
  white: "#F5E6D3",
  milk: "#8B5A2B",
};

const FLAVOR_LABEL: Record<Flavor, string> = {
  semi: "Semi Amargo",
  white: "Blanco",
  milk: "Con Leche",
};

const FlavorButton = ({
  flavor,
  isSelected,
  onClick,
}: {
  flavor: Flavor;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <div
    onClick={onClick}
    title={FLAVOR_LABEL[flavor]}
    className={`w-6 h-6 rounded cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-2 border-primary scale-110 shadow-[0_0_0_2px_rgba(166,76,62,0.4)]"
        : "border border-border"
    }`}
    style={{ backgroundColor: FLAVOR_SWATCH[flavor] }}
  />
);

const getObjectPosition = (categoryId: string, flavor: Flavor) => {
  if (categoryId === "Simples Chicos" && (flavor === "semi" || flavor === "milk")) return "center 65%";
  if (categoryId === "Simples Grandes" && (flavor === "semi" || flavor === "milk")) return "30% 50%";
  return "center center";
};

const CategoryCard = ({
  type,
  isSelected,
  onToggle,
}: {
  type: ProductType;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor>("milk");
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [selectedFlavor, type.id]);

  const handleFlavorClick = (e: React.MouseEvent, flavor: Flavor) => {
    e.stopPropagation();
    setSelectedFlavor(flavor);
  };

  const imagePath = type.images[selectedFlavor];

  return (
    <div
      onClick={onToggle}
      className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col border-2 ${
        isSelected
          ? "border-primary bg-[#FDF8F5] shadow-[0_4px_12px_rgba(166,76,62,0.2)]"
          : "border-border bg-transparent"
      }`}
    >
      <div className="h-[200px] bg-[#f0f0f0] flex flex-col items-center justify-center overflow-hidden relative">
        {imagePath && !imgError ? (
          <img
            key={imagePath}
            src={imagePath}
            alt={`${type.title} ${selectedFlavor}`}
            className="w-full h-full object-cover"
            style={{ objectPosition: getObjectPosition(type.id, selectedFlavor) }}
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <span className="text-[40px] mb-1">🍫</span>
            <span className="text-[#aaa] font-bold">{type.title}</span>
            <span className="text-[0.8rem] text-[#ccc]">Preview</span>
          </>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="m-0 mb-2 text-primary text-lg font-black font-sans">{type.title}</h3>

        <div className="category-card-details">
          <span>⚖️ {type.weight}</span>
          <span>📏 {type.size}</span>
        </div>

        <div className="mt-auto border-t border-border pt-4 flex items-center justify-between">
          <span className="text-[0.8rem] text-textLight">Ver sabor:</span>
          <div className="flex gap-2">
            {(["semi", "white", "milk"] as Flavor[]).map((flavor) => (
              <FlavorButton
                key={flavor}
                flavor={flavor}
                isSelected={selectedFlavor === flavor}
                onClick={(e) => handleFlavorClick(e, flavor)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    fetchCategories()
      .then(setProductTypes)
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  if (productTypes.length === 0) return null;

  return (
    <section className="showcase-section bg-white">
      <div className="max-w-[1200px] mx-auto text-center mb-8">
        <h2 className="text-xl text-primary mb-4 font-black">Tamaños</h2>
        <p className="text-textLight font-normal">Elegí un tamaño para ver las distintas presentaciones.</p>
      </div>

      <div className="showcase-grid">
        {productTypes.map((type) => (
          <CategoryCard
            key={type.id}
            type={type}
            isSelected={selectedCategory === type.id}
            onToggle={() => onSelectCategory(selectedCategory === type.id ? null : type.id)}
          />
        ))}
      </div>
    </section>
  );
};

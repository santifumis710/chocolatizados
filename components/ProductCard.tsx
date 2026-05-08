"use client";

import React from "react";

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
      className="w-full p-0 bg-white border-2 border-secondary rounded-xl cursor-pointer transition-all duration-300 shadow-sm text-center flex flex-col items-center overflow-hidden"
    >
      <div className="w-full h-[200px] bg-[#f0f0f0] flex items-center justify-center border-b border-border">
        {!imgError && image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
            style={{ objectPosition: imagePosition || "center center" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl">🍫</span>
        )}
      </div>

      <div className="p-4 w-full">
        <h3 className="m-0 mb-2 text-lg text-primary font-black font-sans">
          {name.split(/(\(.*?\))/).map((part, index) =>
            part.startsWith("(") && part.endsWith(")") ? (
              <span key={index} className="whitespace-nowrap">{part}</span>
            ) : (
              part
            )
          )}
        </h3>
        <p className="m-0 text-base text-textLight font-sans">
          ${price.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>
    </button>
  );
};

"use client";

import React from "react";

interface CartWidgetProps {
  itemCount: number;
  onClick: () => void;
}

export const CartWidget: React.FC<CartWidgetProps> = ({ itemCount, onClick }) => (
  <button
    onClick={onClick}
    aria-label={`Carrito de compras con ${itemCount} items`}
    className="relative bg-transparent border-none cursor-pointer p-1 mt-[2px] flex items-center justify-center transition-transform duration-300 hover:scale-125"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>

    {itemCount > 0 && (
      <div className="absolute -top-[5px] -right-[5px] bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
        {itemCount > 99 ? "99+" : itemCount}
      </div>
    )}
  </button>
);

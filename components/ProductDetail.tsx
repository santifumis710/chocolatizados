"use client";

import React, { useState } from "react";
import { CartItem } from "@/hooks/useCart";

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

const FLAVORS = ["Semi-amargo", "Blanco", "Con leche"];
const FILLINGS = ["Dulce de leche"];
const PASTAS = ["Chocolate", "Mani", "Frutilla", "Tiramisu", "Bananita", "Menta", "Avellana"];

const pillClass = (selected: boolean) =>
  `px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 border ${
    selected
      ? "bg-primary text-white border-primary shadow-sm"
      : "bg-white text-text border-border"
  }`;

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedFillings, setSelectedFillings] = useState<string[]>([]);
  const [selectedPastas, setSelectedPastas] = useState<string[]>([]);
  const [showFlavorError, setShowFlavorError] = useState(false);
  const [showFillingError, setShowFillingError] = useState(false);

  React.useEffect(() => {
    if (product) {
      setQuantity(product.min_quantity || 1);
      setSelectedOption("");
      setSelectedFlavors([]);
      setSelectedFillings([]);
      setSelectedPastas([]);
      setShowFlavorError(false);
      setShowFillingError(false);
    }
  }, [product]);

  const optionsList = product?.options
    ? product.options.split(",").map((opt) => {
        const parts = opt.trim().split("|");
        return { name: parts[0], price: parseFloat(parts[1] || "0") };
      })
    : [];

  React.useEffect(() => {
    if (product) {
      if (optionsList.length > 0 && !selectedOption) {
        setSelectedOption(optionsList[0].name);
        setSelectedPrice(optionsList[0].price);
      } else if (optionsList.length === 0) {
        setSelectedPrice(product.price);
      }
    }
  }, [product, optionsList, selectedOption]);

  const handleAddToCart = () => {
    if (!product) return;

    let isValid = true;

    if (selectedFlavors.length === 0) {
      setShowFlavorError(true);
      isValid = false;
    } else {
      setShowFlavorError(false);
    }

    if (product.category === "Bombones Rellenos") {
      if (selectedFillings.length === 0 && selectedPastas.length === 0) {
        setShowFillingError(true);
        isValid = false;
      } else {
        setShowFillingError(false);
      }
    }

    if (!isValid) return;

    const flavorsText = selectedFlavors.length > 0 ? `(Sabores: ${selectedFlavors.join(", ")})` : "";
    const allFillings = [...selectedFillings, ...selectedPastas];
    const fillingsText = allFillings.length > 0 ? `(Rellenos: ${allFillings.join(", ")})` : "";
    const finalNotes = [flavorsText, fillingsText, notes].filter(Boolean).join(" ");

    onAddToCart(
      {
        product_id: product.id,
        name: product.name,
        price: selectedPrice,
        allows_customization: product.allows_customization,
        customization_text: finalNotes || undefined,
        image_url: undefined,
        min_quantity: product.min_quantity || 1,
      },
      quantity
    );
    onClose();
  };

  const minQty = product?.min_quantity || 1;

  if (!product) return null;

  const toggle = (list: string[], setter: (v: string[]) => void, value: string) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 z-[999]" />

      <div className="fixed top-0 right-0 h-[100dvh] w-[450px] max-w-full bg-white shadow-lg z-[1000] flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background">
          <h2 className="m-0 text-xl text-primary font-black font-sans">{product.name}</h2>
          <button onClick={onClose} className="bg-transparent border-none text-2xl cursor-pointer text-text">
            ✕
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Quantity */}
          <div className="mb-6 p-4 bg-background rounded">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-text">📊 Cantidad:</label>
              {minQty > 1 && (
                <span className="text-xs text-secondary font-bold">(Mínimo {minQty} unidades)</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                disabled={quantity <= minQty}
                className="w-10 h-10 rounded border border-border text-lg font-bold bg-background text-text disabled:bg-[#eee] disabled:text-[#aaa] disabled:cursor-not-allowed cursor-pointer"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                className="flex-1 p-2 border border-border rounded text-base text-center"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded border border-border text-lg font-bold bg-background cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Flavors */}
          <div
            className={`mb-6 p-4 bg-background rounded ${
              showFlavorError ? "border-2 border-error" : ""
            }`}
          >
            <label
              className={`block mb-2 text-sm font-bold ${
                showFlavorError ? "text-error" : "text-text"
              }`}
            >
              🍫 Elegí el/los sabor/es que prefieras: {showFlavorError && "(Requerido)"}
            </label>
            <div className="flex gap-2 flex-wrap justify-center">
              {FLAVORS.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => toggle(selectedFlavors, setSelectedFlavors, flavor)}
                  className={pillClass(selectedFlavors.includes(flavor))}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          {/* Fillings (only for Bombones Rellenos) */}
          {product.category === "Bombones Rellenos" && (
            <div
              className={`mb-6 p-4 bg-background rounded ${
                showFillingError ? "border-2 border-error" : ""
              }`}
            >
              <label
                className={`block mb-2 text-sm font-bold ${
                  showFillingError ? "text-error" : "text-text"
                }`}
              >
                🍫 Elegí el/los relleno/s que prefieras: {showFillingError && "(Requerido)"}
              </label>

              <div className="flex gap-2 flex-wrap justify-center mb-2">
                {FILLINGS.map((filling) => (
                  <button
                    key={filling}
                    onClick={() => toggle(selectedFillings, setSelectedFillings, filling)}
                    className={pillClass(selectedFillings.includes(filling))}
                  >
                    {filling}
                  </button>
                ))}
              </div>

              <label className="block mb-2 mt-4 text-sm font-bold text-text text-center">
                y/o pasta sabor:
              </label>

              <div className="flex gap-2 flex-wrap justify-center">
                {PASTAS.map((pasta) => (
                  <button
                    key={pasta}
                    onClick={() => toggle(selectedPastas, setSelectedPastas, pasta)}
                    className={pillClass(selectedPastas.includes(pasta))}
                  >
                    {pasta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6 p-4 bg-background rounded">
            <label className="block mb-1 text-sm font-bold text-text">
              ✨ Momento de personalizar tus chocolates!!
            </label>
            <p className="text-xs text-textLight mb-2 mt-0">
              Escribí todo lo que puedas para ayudarme a diseñar tus chocolates… Luego, seguimos por whatsapp.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe tus ideas..."
              maxLength={500}
              className="w-full min-h-[120px] p-2 border border-secondary rounded text-sm font-sans box-border"
            />
            <p className="mt-1 text-xs text-textLight">{notes.length}/500 caracteres</p>
          </div>

          {/* Subtotal */}
          <div className="mb-6 p-4 bg-background rounded">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal:</span>
              <span className="text-primary">${(selectedPrice * quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t border-border bg-background"
          style={{ paddingBottom: "calc(30px + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={handleAddToCart}
            className="w-full p-4 bg-primary text-white border-none rounded text-base font-bold cursor-pointer transition-colors duration-300"
          >
            🛒 Agregar al carrito
          </button>
          <button
            onClick={onClose}
            className="w-full mt-4 p-4 bg-white text-primary border border-primary rounded text-base cursor-pointer transition-all duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
};

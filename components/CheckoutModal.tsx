"use client";

import React, { useState } from "react";
import { CartItem } from "@/hooks/useCart";
import { validateDiscountCode } from "@/services/api";

interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}

export interface DiscountInfo {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  final_total: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSubmit: (data: CheckoutData & { items: CartItem[]; discount?: DiscountInfo }) => void;
  isLoading?: boolean;
}

const inputClass = (hasError: boolean) =>
  `w-full p-4 rounded text-base font-sans box-border border ${
    hasError ? "border-error" : "border-border"
  }`;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  total,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CheckoutData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError("");
    setDiscountInfo(null);
    setDiscountLoading(true);
    try {
      const result = await validateDiscountCode(discountCode.trim(), total);
      setDiscountInfo(result);
    } catch (err: any) {
      setDiscountError(err.message || "Código inválido");
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountInfo(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) newErrors.customer_name = "El nombre es requerido";

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "El teléfono es requerido";
    } else if (formData.customer_phone.replace(/\D/g, "").length < 10) {
      newErrors.customer_phone = "Teléfono inválido (mínimo 10 dígitos)";
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateForm()) setStep(2);
      return;
    }
    onSubmit({ ...formData, items, discount: discountInfo ?? undefined });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (!isOpen) return null;

  const stepTitle = step === 0 ? "¿Tenés un código de descuento?" : step === 1 ? "Confirma tu pedido" : "¡Todo Listo!";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[1999]" />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg z-[2000] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="m-0 text-xl text-primary">{stepTitle}</h2>
          <button onClick={onClose} className="bg-transparent border-none text-2xl cursor-pointer text-text">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 0 ? (
            <>
              {/* Order summary */}
              <div className="mb-6 p-4 bg-background rounded">
                <h3 className="m-0 mb-2 text-base text-primary">📦 Tu pedido ({items.length} {items.length === 1 ? "item" : "items"})</h3>
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.customization_text || "default"}`}
                    className="flex justify-between mb-1 text-sm"
                  >
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">${(item.price * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-border">
                  {discountInfo ? (
                    <>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Subtotal:</span>
                        <span>${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 mb-1">
                        <span>
                          🏷️ Descuento ({discountInfo.code}
                          {discountInfo.discount_type === "percentage"
                            ? ` −${discountInfo.discount_value}%`
                            : ""}):
                        </span>
                        <span>−${discountInfo.discount_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base mt-1">
                        <span>Total:</span>
                        <span className="text-primary">${discountInfo.final_total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span className="text-primary">${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Discount code input */}
              {discountInfo ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <span className="text-green-700 text-sm font-bold">
                    ✅ Código <strong>{discountInfo.code}</strong> aplicado
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    className="text-gray-400 text-sm bg-transparent border-none cursor-pointer underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-bold text-text">🏷️ Código de descuento</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setDiscountError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyDiscount())}
                      placeholder="Código de descuento"
                      className="flex-1 p-4 rounded text-base font-sans box-border border border-border"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                      className="px-4 py-2 bg-primary text-white border-none rounded text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {discountLoading ? "..." : "Aplicar"}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-error text-sm mt-1">{discountError}</p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 p-4 bg-primary text-white border-none rounded text-base font-bold cursor-pointer"
                >
                  Continuar
                </button>
                {!discountInfo && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 p-4 bg-white text-primary border border-primary rounded text-base cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </>
          ) : step === 1 ? (
            <>
              <div className="mb-6 p-4 bg-background rounded">
                <h3 className="m-0 mb-2 text-base text-primary">📦 Tu pedido ({items.length} {items.length === 1 ? "item" : "items"})</h3>
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.customization_text || "default"}`}
                    className="flex justify-between mb-1 text-sm"
                  >
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">${(item.price * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-border">
                  {discountInfo ? (
                    <>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Subtotal:</span>
                        <span>${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 mb-1">
                        <span>
                          🏷️ Descuento ({discountInfo.code}
                          {discountInfo.discount_type === "percentage"
                            ? ` −${discountInfo.discount_value}%`
                            : ""}):
                        </span>
                        <span>−${discountInfo.discount_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base mt-1">
                        <span>Total:</span>
                        <span className="text-primary">${discountInfo.final_total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span className="text-primary">${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-bold text-text">👤 Nombre completo *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  className={inputClass(!!errors.customer_name)}
                />
                {errors.customer_name && (
                  <p className="text-error text-sm mt-1">{errors.customer_name}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-bold text-text">📞 Teléfono de WhatsApp *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+54 9 342 1234567"
                  className={inputClass(!!errors.customer_phone)}
                />
                {errors.customer_phone && (
                  <p className="text-error text-sm mt-1">{errors.customer_phone}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-bold text-text">📧 Email *</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="juan@email.com"
                  className={inputClass(!!errors.customer_email)}
                />
                {errors.customer_email && (
                  <p className="text-error text-sm mt-1">{errors.customer_email}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 p-4 bg-primary text-white border-none rounded text-base font-bold cursor-pointer"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="p-4 bg-white text-text border border-border rounded text-base cursor-pointer"
                >
                  Atrás
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 text-left">
                <p className="text-base mb-4">
                  Gracias por tu pedido, <strong>{formData.customer_name}</strong>.
                </p>
                <p className="text-base mb-4">
                  Solo queda que me confirmes para qué fechas queres tus chocolates, cómo los queres abonar y cómo te gustaría la personalización de los mismos, podés enviarme el logo de tu empresa, imagen que te guste o detalles a tener en cuenta como colores o tipos de letras.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 p-4 bg-primary text-white border-none rounded text-base font-bold flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {isLoading ? "Procesando..." : "📲 Enviar a WhatsApp"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-4 bg-white text-text border border-border rounded text-base cursor-pointer"
                >
                  Atrás
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

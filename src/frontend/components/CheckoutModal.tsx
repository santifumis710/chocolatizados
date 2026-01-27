/**
 * Componente: CheckoutModal
 * 
 * Modal para ingresar datos del cliente antes de enviar a WhatsApp
 * Campos: Nombre, Email, Teléfono, Dirección (opcional)
 */

"use client";

import React, { useState } from "react";
import { CartItem } from "@/hooks/useCart";
import { colors, spacing, typography, shadows, borderRadius } from "@/theme";

interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSubmit: (data: CheckoutData & { items: CartItem[] }) => void;
  isLoading?: boolean;
}

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

  const [step, setStep] = useState<1 | 2>(1);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "El nombre es requerido";
    }

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
      if (validateForm()) {
        setStep(2);
      }
      return;
    }

    onSubmit({
      ...formData,
      items,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1999,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: colors.white,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.lg,
          zIndex: 2000,
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: typography.sizes.xl,
              color: colors.primary,
            }}
          >
            {step === 1 ? "Confirma tu pedido" : "¡Todo Listo!"}
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
        <form onSubmit={handleSubmit} style={{ padding: spacing.lg }}>

          {step === 1 ? (
            <>
              {/* Step 1: Form & Summary */}
              <div
                style={{
                  marginBottom: spacing.lg,
                  padding: spacing.md,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                }}
              >
                <h3
                  style={{
                    margin: `0 0 ${spacing.sm} 0`,
                    fontSize: typography.sizes.base,
                    color: colors.primary,
                  }}
                >
                  📦 Tu pedido ({items.length} items)
                </h3>
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.customization_text || "default"}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: spacing.xs,
                      fontSize: typography.sizes.sm,
                    }}
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: spacing.sm,
                    paddingTop: spacing.sm,
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: typography.sizes.base,
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: colors.primary }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: typography.sizes.sm,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  👤 Nombre completo *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  style={{
                    width: "100%",
                    padding: spacing.md,
                    border: `1px solid ${errors.customer_name ? colors.error : colors.border}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    fontFamily: typography.fontFamily,
                    boxSizing: "border-box",
                  }}
                />
                {errors.customer_name && (
                  <p
                    style={{
                      color: colors.error,
                      fontSize: typography.sizes.sm,
                      margin: `${spacing.xs} 0 0 0`,
                    }}
                  >
                    {errors.customer_name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: spacing.lg }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: typography.sizes.sm,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  📞 Teléfono de WhatsApp *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+54 9 342 1234567"
                  style={{
                    width: "100%",
                    padding: spacing.md,
                    border: `1px solid ${errors.customer_phone ? colors.error : colors.border}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    fontFamily: typography.fontFamily,
                    boxSizing: "border-box",
                  }}
                />
                {errors.customer_phone && (
                  <p
                    style={{
                      color: colors.error,
                      fontSize: typography.sizes.sm,
                      margin: `${spacing.xs} 0 0 0`,
                    }}
                  >
                    {errors.customer_phone}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: spacing.lg }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: spacing.sm,
                    fontSize: typography.sizes.sm,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  📧 Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="juan@email.com"
                  style={{
                    width: "100%",
                    padding: spacing.md,
                    border: `1px solid ${errors.customer_email ? colors.error : colors.border}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    fontFamily: typography.fontFamily,
                    boxSizing: "border-box",
                  }}
                />
                {errors.customer_email && (
                  <p
                    style={{
                      color: colors.error,
                      fontSize: typography.sizes.sm,
                      margin: `${spacing.xs} 0 0 0`,
                    }}
                  >
                    {errors.customer_email}
                  </p>
                )}
              </div>

              {/* Buttons Step 1 */}
              <div style={{ display: "flex", gap: spacing.md }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: "none",
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    backgroundColor: colors.white,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Confirmation Message */}
              <div style={{ marginBottom: spacing.lg, textAlign: "left" }}>
                <p style={{ fontSize: typography.sizes.base, marginBottom: spacing.md }}>
                  Gracias por tu pedido, <strong>{formData.customer_name}</strong>.
                </p>
                <p style={{ fontSize: typography.sizes.base, marginBottom: spacing.md }}>
                  Solo queda que me confirmes para qué fechas queres tus chocolates, cómo los queres abonar y cómo te gustaría la personalización de los mismos, podés enviarme el logo de tu empresa, imagen que te guste o detalles a tener en cuenta como colores o tipos de letras.
                </p>
              </div>

              {/* Buttons Step 2 */}
              <div style={{ display: "flex", gap: spacing.md }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    backgroundColor: colors.primary, // Green color for WhatsApp? Or keep primary
                    color: colors.white,
                    border: "none",
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    fontWeight: "bold",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing.sm
                  }}
                >
                  {isLoading ? "Procesando..." : "📲 Enviar a WhatsApp"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: spacing.md,
                    backgroundColor: colors.white,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.sizes.base,
                    cursor: "pointer",
                  }}
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

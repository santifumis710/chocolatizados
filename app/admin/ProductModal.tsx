"use client";

import React, { useState, useEffect } from "react";
import { colors, spacing, borderRadius } from "@/theme";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image_url: string;
    description: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product?: Product | null; // If null, we are creating
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    product,
}) => {
    const [formData, setFormData] = useState<Product>({
        id: 0,
        name: "",
        price: 0,
        category: "Tabletas",
        image_url: "",
        description: "",
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            // Reset for new product
            setFormData({
                id: Date.now(), // Temporary ID generation for new items
                name: "",
                price: 0,
                category: "Tabletas",
                image_url: "",
                description: "",
            });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: colors.white,
                    padding: spacing.xl,
                    borderRadius: borderRadius.lg,
                    width: "500px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <h2 style={{ color: colors.primary, marginBottom: spacing.lg }}>
                    {product ? "Editar Producto" : "Nuevo Producto"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* ID (Read only for edits, mostly hidden or auto for new) */}
                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>ID</label>
                        <input
                            type="number"
                            name="id"
                            value={formData.id}
                            disabled={!!product} // Disable ID editing for existing
                            onChange={handleChange}
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                        />
                    </div>

                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                        />
                    </div>

                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>Precio ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                        />
                    </div>

                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                        >
                            <option value="Tabletas">Tabletas</option>
                            <option value="Tabletas Chicas">Tabletas Chicas</option>
                            <option value="Simples Chicos">Simples Chicos</option>
                            <option value="Simples Grandes">Simples Grandes</option>
                            <option value="Bombones Rellenos">Bombones Rellenos</option>
                            <option value="Barritas Rellenas">Barritas Rellenas</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>Imagen URL</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url || ""}
                            onChange={handleChange}
                            placeholder="/images/products/..."
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                        />
                    </div>

                    <div style={{ marginBottom: spacing.md }}>
                        <label style={{ display: "block", marginBottom: spacing.xs }}>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            style={{ width: "100%", padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}`, minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: spacing.md, marginTop: spacing.xl }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: colors.textLight,
                                color: colors.white,
                                border: "none",
                                borderRadius: borderRadius.md,
                                cursor: "pointer",
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: colors.primary,
                                color: colors.white,
                                border: "none",
                                borderRadius: borderRadius.md,
                                cursor: "pointer",
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

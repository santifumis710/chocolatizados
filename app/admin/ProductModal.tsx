"use client";

import React, { useState, useEffect } from "react";

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
    product?: Product | null;
}

const inputClass = "w-full p-2 rounded-sm border border-border";

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
            setFormData({
                id: Date.now(),
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-primary mb-6">
                    {product ? "Editar Producto" : "Nuevo Producto"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">ID</label>
                        <input
                            type="number"
                            name="id"
                            value={formData.id}
                            disabled={!!product}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Precio ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className={inputClass}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="Tabletas">Tabletas</option>
                            <option value="Tabletas Chicas">Tabletas Chicas</option>
                            <option value="Simples Chicos">Simples Chicos</option>
                            <option value="Simples Grandes">Simples Grandes</option>
                            <option value="Bombones Rellenos">Bombones Rellenos</option>
                            <option value="Barritas Rellenas">Barritas Rellenas</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Imagen URL</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url || ""}
                            onChange={handleChange}
                            placeholder="/images/products/..."
                            className={inputClass}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[80px]`}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-textLight text-white border-none rounded cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white border-none rounded cursor-pointer"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

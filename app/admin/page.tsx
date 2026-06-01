"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    checkAuth,
    logout,
    fetchProducts,
    deleteProduct,
    updateProduct,
    createProduct,
} from '@/services/api';
import { ProductModal } from './ProductModal';
import { OrdersTable } from './OrdersTable';
import { StatsView } from './StatsView';
import { DiscountCodesTab } from './DiscountCodesTab';

type Tab = 'products' | 'orders' | 'stats' | 'discounts';

const tabClass = (active: boolean) =>
    `p-4 bg-transparent border-none cursor-pointer font-bold ${
        active ? 'text-primary border-b-2 border-primary' : 'text-textLight'
    }`;

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);

    useEffect(() => {
        if (!checkAuth()) {
            router.push('/admin/login');
            return;
        }
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data.sort((a: any, b: any) => a.id - b.id));
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Error cargando productos');
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await deleteProduct(id);
            loadProducts();
        } catch {
            alert('Error eliminando');
        }
    };

    const handleEditClick = (product: any) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = async (productData: any) => {
        try {
            if (currentProduct) {
                await updateProduct(productData.id, productData);
            } else {
                await createProduct(productData);
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (e: any) {
            alert(`Error guardando producto: ${e.message}`);
            console.error(e);
        }
    };

    const toggleVisibility = async (product: any) => {
        try {
            await updateProduct(product.id, { ...product, is_visible: !product.is_visible });
            loadProducts();
        } catch (e) {
            alert('Error actualizando visibilidad');
            console.error(e);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="min-h-screen bg-background font-sans p-8">
            <div className="max-w-[1000px] mx-auto bg-white p-8 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl text-primary m-0">Panel de Administración</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-textLight rounded bg-transparent cursor-pointer"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-border">
                    <button onClick={() => setActiveTab('products')} className={tabClass(activeTab === 'products')}>
                        📦 Productos
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={tabClass(activeTab === 'orders')}>
                        📋 Pedidos
                    </button>
                    <button onClick={() => setActiveTab('stats')} className={tabClass(activeTab === 'stats')}>
                        📊 Estadísticas
                    </button>
                    <button onClick={() => setActiveTab('discounts')} className={tabClass(activeTab === 'discounts')}>
                        🏷️ Descuentos
                    </button>
                </div>

                {activeTab === 'products' ? (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleCreateClick}
                                className="px-4 py-2 bg-primary text-white border-none rounded cursor-pointer font-bold"
                            >
                                + Nuevo Producto
                            </button>
                        </div>

                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-border text-left">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Imagen</th>
                                    <th className="p-2">Nombre</th>
                                    <th className="p-2">Precio</th>
                                    <th className="p-2">Visible</th>
                                    <th className="p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-border">
                                        <td className="p-2">{p.id}</td>
                                        <td className="p-2">
                                            {p.image_url && (
                                                <img
                                                    src={p.image_url}
                                                    alt=""
                                                    className="w-10 h-10 object-cover rounded-sm"
                                                />
                                            )}
                                        </td>
                                        <td className="p-2 font-bold">{p.name}</td>
                                        <td className="p-2">${p.price.toLocaleString('es-AR')}</td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => toggleVisibility(p)}
                                                title={p.is_visible !== false ? "Ocultar" : "Mostrar"}
                                                className="bg-transparent border-none cursor-pointer text-[1.2rem]"
                                            >
                                                {p.is_visible !== false ? '👁️' : '🔒'}
                                            </button>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => handleEditClick(p)}
                                                className="mr-2 cursor-pointer text-blue-600 bg-transparent border-none"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="cursor-pointer text-red-600 bg-transparent border-none"
                                            >
                                                🗑️ Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <ProductModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSave}
                            product={currentProduct}
                        />
                    </>
                ) : activeTab === 'orders' ? (
                    <OrdersTable />
                ) : activeTab === 'stats' ? (
                    <StatsView />
                ) : (
                    <DiscountCodesTab />
                )}
            </div>
        </div>
    );
}

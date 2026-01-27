'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, logout, fetchProducts, deleteProduct, updateProduct, createProduct } from '@/services/api';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { ProductModal } from './ProductModal';
import { OrdersTable } from './OrdersTable';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null); // null = new, object = edit

    // Load initial data
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
            loadProducts(); // Refresh
        } catch (e) {
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
                // Update
                await updateProduct(productData.id, productData);
            } else {
                // Create
                await createProduct(productData);
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (e) {
            alert('Error guardando producto');
            console.error(e);
        }
    };

    if (loading) return <div style={{ padding: spacing.xl }}>Cargando...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.background,
            fontFamily: typography.fontFamily,
            padding: spacing.xl
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                backgroundColor: colors.white,
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
                    <h1 style={{ fontSize: typography.sizes.xl, color: colors.primary, margin: 0 }}>Panel de Administración</h1>

                    <button onClick={logout} style={{
                        padding: '8px 16px',
                        border: `1px solid ${colors.textLight}`,
                        borderRadius: borderRadius.md,
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                    }}>Cerrar Sesión</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, borderBottom: `1px solid ${colors.border}` }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: spacing.md,
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'products' ? `2px solid ${colors.primary}` : 'none',
                            color: activeTab === 'products' ? colors.primary : colors.textLight,
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        📦 Productos
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: spacing.md,
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'orders' ? `2px solid ${colors.primary}` : 'none',
                            color: activeTab === 'orders' ? colors.primary : colors.textLight,
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        📋 Pedidos
                    </button>
                </div>

                {activeTab === 'products' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: spacing.md }}>
                            <button onClick={handleCreateClick} style={{
                                padding: '8px 16px',
                                backgroundColor: colors.primary,
                                color: colors.white,
                                border: 'none',
                                borderRadius: borderRadius.md,
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}>+ Nuevo Producto</button>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.border}`, textAlign: 'left' }}>
                                    <th style={{ padding: spacing.sm }}>ID</th>
                                    <th style={{ padding: spacing.sm }}>Imagen</th>
                                    <th style={{ padding: spacing.sm }}>Nombre</th>
                                    <th style={{ padding: spacing.sm }}>Precio</th>
                                    <th style={{ padding: spacing.sm }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td style={{ padding: spacing.sm }}>{p.id}</td>
                                        <td style={{ padding: spacing.sm }}>
                                            {p.image_url && <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                        </td>
                                        <td style={{ padding: spacing.sm, fontWeight: 'bold' }}>{p.name}</td>
                                        <td style={{ padding: spacing.sm }}>${p.price.toLocaleString('es-AR')}</td>
                                        <td style={{ padding: spacing.sm }}>
                                            <button onClick={() => handleEditClick(p)} style={{ marginRight: spacing.sm, cursor: 'pointer', color: 'blue', background: 'none', border: 'none' }}>
                                                ✏️ Editar
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', color: 'red', background: 'none', border: 'none' }}>
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
                ) : (
                    <OrdersTable />
                )}
            </div>
        </div>
    );
}

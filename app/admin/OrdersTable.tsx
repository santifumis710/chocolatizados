import React, { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/services/api";
import { colors, spacing, typography, borderRadius } from "@/theme";

export const OrdersTable = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "#FFF9C4"; // Lys gul
            case "completed": return "#C8E6C9"; // Lys grøn
            case "cancelled": return "#FFCDD2"; // Lys rød
            default: return colors.white;
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            // Sort by date desc
            setOrders(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Error cargando pedidos");
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
            loadOrders();
        } catch (e) {
            alert("Error actualizando estado");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este pedido?")) return;
        try {
            await deleteOrder(id);
            loadOrders();
        } catch (e) {
            alert("Error eliminando pedido");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (loading) return <div>Cargando pedidos...</div>;

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: spacing.sm }}>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                        padding: spacing.sm,
                        borderRadius: borderRadius.sm,
                        border: "1px solid " + colors.border,
                        marginRight: spacing.sm,
                        fontFamily: typography.fontFamily,
                    }}
                >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                <button
                    onClick={loadOrders}
                    style={{
                        cursor: "pointer",
                        background: colors.white,
                        border: "1px solid " + colors.border,
                        borderRadius: borderRadius.sm,
                        padding: spacing.sm,
                        fontSize: typography.sizes.sm,
                        display: "flex",
                        alignItems: "center",
                        gap: spacing.xs
                    }}
                >
                    🔄 Actualizar
                </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.border}`, textAlign: "left" }}>
                        <th style={{ padding: spacing.sm }}>Fecha</th>
                        <th style={{ padding: spacing.sm }}>Cliente</th>
                        <th style={{ padding: spacing.sm }}>Total</th>
                        <th style={{ padding: spacing.sm }}>Estado</th>
                        <th style={{ padding: spacing.sm }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.filter(order => filterStatus === "all" || order.status === filterStatus).length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ padding: spacing.lg, textAlign: "center", color: colors.textLight }}>
                                No hay pedidos registrados aún.
                            </td>
                        </tr>
                    ) : (
                        orders
                            .filter(order => filterStatus === "all" || order.status === filterStatus)
                            .map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td style={{ padding: spacing.sm }}>{new Date(order.date).toLocaleDateString()}</td>
                                        <td style={{ padding: spacing.sm }}>
                                            <div>{order.customer_name}</div>
                                            <div style={{ fontSize: typography.sizes.xs, color: colors.textLight }}>{order.customer_phone}</div>
                                        </td>
                                        <td style={{ padding: spacing.sm }}>${order.total.toFixed(2)}</td>
                                        <td style={{ padding: spacing.sm }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{
                                                    padding: spacing.xs,
                                                    borderRadius: borderRadius.md,
                                                    backgroundColor: getStatusColor(order.status),
                                                    border: "1px solid " + colors.border
                                                }}
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="completed">Completado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: spacing.sm }}>
                                            <button onClick={() => toggleExpand(order.id)} style={{ marginRight: spacing.sm, cursor: "pointer", background: "none", border: "none" }}>
                                                {expandedOrderId === order.id ? "🔽" : "▶️"}
                                            </button>
                                            <button onClick={() => handleDelete(order.id)} style={{ cursor: "pointer", background: "none", border: "none" }}>
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order.id && (
                                        <tr style={{ backgroundColor: colors.background }}>
                                            <td colSpan={5} style={{ padding: spacing.md }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
                                                    <strong>Detalles del Pedido:</strong>
                                                    <ul style={{ margin: 0, paddingLeft: spacing.lg }}>
                                                        {order.items.map((item: any, idx: number) => (
                                                            <li key={idx}>
                                                                {item.quantity}x {item.name}
                                                                {item.customization_text && <span style={{ color: colors.textLight }}> ({item.customization_text})</span>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {order.delivery_address && <div><strong>Dirección:</strong> {order.delivery_address}</div>}
                                                    {order.notes && <div><strong>Notas:</strong> {order.notes}</div>}
                                                    <div><strong>Email:</strong> {order.customer_email}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

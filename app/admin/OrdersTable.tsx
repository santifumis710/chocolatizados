import React, { useState, useEffect } from "react";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/services/api";

const STATUS_BG: Record<string, string> = {
    pending: "#FFF9C4",
    completed: "#C8E6C9",
    cancelled: "#FFCDD2",
};

export const OrdersTable = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(
                data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
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
        } catch {
            alert("Error actualizando estado");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este pedido?")) return;
        try {
            await deleteOrder(id);
            loadOrders();
        } catch {
            alert("Error eliminando pedido");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (loading) return <div>Cargando pedidos...</div>;

    const visible = orders.filter(
        (o) => filterStatus === "all" || o.status === filterStatus
    );

    return (
        <div className="w-full">
            <div className="flex justify-end mb-2 gap-2">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 rounded-sm border border-border font-sans"
                >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                <button
                    onClick={loadOrders}
                    className="cursor-pointer bg-white border border-border rounded-sm p-2 text-sm flex items-center gap-1"
                >
                    🔄 Actualizar
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-border text-left">
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {visible.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-textLight">
                                No hay pedidos registrados aún.
                            </td>
                        </tr>
                    ) : (
                        visible.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr className="border-b border-border">
                                    <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="p-2">
                                        <div>{order.customer_name}</div>
                                        <div className="text-xs text-textLight">{order.customer_phone}</div>
                                    </td>
                                    <td className="p-2">${order.total.toFixed(2)}</td>
                                    <td className="p-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="p-1 rounded border border-border"
                                            style={{ backgroundColor: STATUS_BG[order.status] || "#fff" }}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="completed">Completado</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => toggleExpand(order.id)}
                                            className="mr-2 cursor-pointer bg-transparent border-none"
                                        >
                                            {expandedOrderId === order.id ? "🔽" : "▶️"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="cursor-pointer bg-transparent border-none"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
                                    <tr className="bg-background">
                                        <td colSpan={5} className="p-4">
                                            <div className="flex flex-col gap-2">
                                                <strong>Detalles del Pedido:</strong>
                                                <ul className="m-0 pl-6">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <li key={idx}>
                                                            {item.quantity}x {item.name}
                                                            {item.customization_text && (
                                                                <span className="text-textLight"> ({item.customization_text})</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {order.delivery_address && (
                                                    <div><strong>Dirección:</strong> {order.delivery_address}</div>
                                                )}
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

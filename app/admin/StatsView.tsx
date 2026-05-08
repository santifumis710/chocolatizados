import React, { useState, useEffect } from 'react';
import { fetchOrders } from '@/services/api';

const COLORS = {
    primary: "#A83A2B",
    secondary: "#CDAA7D",
    success: "#388E3C",
    textLight: "#666666",
};

const MetricCard = ({
    title,
    value,
    color,
}: {
    title: string;
    value: string;
    color: string;
}) => (
    <div
        className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-2 border-b-4"
        style={{ borderBottomColor: color }}
    >
        <div className="text-base text-textLight">{title}</div>
        <div className="text-xl font-bold text-text">{value}</div>
    </div>
);

export const StatsView = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (order.status === 'cancelled') return false;
        if (!startDate && !endDate) return true;

        const orderDate = new Date(order.date);
        const start = startDate ? new Date(startDate) : new Date('2000-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        return orderDate >= start && orderDate <= end;
    });

    const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const totalItemsSold = filteredOrders.reduce((sum, order) => {
        const orderItems = order.items?.reduce(
            (itemSum: number, item: any) => itemSum + (item.quantity || 0),
            0
        ) || 0;
        return sum + orderItems;
    }, 0);
    const averageTicket = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    if (loading) return <div>Cargando estadísticas...</div>;

    return (
        <div className="p-4">
            <div className="mb-8 p-6 bg-background rounded flex gap-6 items-end flex-wrap">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Desde:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 rounded-sm border border-border"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Hasta:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 rounded-sm border border-border"
                    />
                </div>
                <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="p-2 bg-white border border-border rounded-sm cursor-pointer font-bold text-text"
                >
                    Ver Todos
                </button>
            </div>

            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                <MetricCard title="Ingresos Totales" value={`$${totalEarnings.toLocaleString('es-AR')}`} color={COLORS.success} />
                <MetricCard title="Chocolates Vendidos" value={totalItemsSold.toString()} color={COLORS.primary} />
                <MetricCard title="Pedidos Totales" value={totalOrders.toString()} color={COLORS.secondary} />
                <MetricCard
                    title="Ticket Promedio"
                    value={`$${averageTicket.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                    color={COLORS.textLight}
                />
            </div>

            <div className="mt-8 text-textLight text-sm">
                * Los pedidos cancelados no se incluyen en las estadísticas.
            </div>
        </div>
    );
};

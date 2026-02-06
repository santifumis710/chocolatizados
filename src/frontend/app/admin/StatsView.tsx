import React, { useState, useEffect } from 'react';
import { fetchOrders } from '@/services/api';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

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

    // Filter logic
    const filteredOrders = orders.filter(order => {
        if (order.status === 'cancelled') return false; // Exclude cancelled from stats
        if (!startDate && !endDate) return true; // Show all if no dates

        const orderDate = new Date(order.date);
        const start = startDate ? new Date(startDate) : new Date('2000-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999); // End of day

        return orderDate >= start && orderDate <= end;
    });

    // Metrics calculation
    const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;

    // Count total items sold
    const totalItemsSold = filteredOrders.reduce((sum, order) => {
        const orderItems = order.items?.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0) || 0;
        return sum + orderItems;
    }, 0);

    const averageTicket = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    };

    if (loading) return <div>Cargando estadísticas...</div>;

    return (
        <div style={{ padding: spacing.md }}>
            {/* Filters */}
            <div style={{
                marginBottom: spacing.xl,
                padding: spacing.lg,
                backgroundColor: colors.background,
                borderRadius: borderRadius.md,
                display: 'flex',
                gap: spacing.lg,
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <label style={{ fontSize: typography.sizes.sm, fontWeight: 'bold' }}>Desde:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <label style={{ fontSize: typography.sizes.sm, fontWeight: 'bold' }}>Hasta:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ padding: spacing.sm, borderRadius: borderRadius.sm, border: `1px solid ${colors.border}` }}
                    />
                </div>
                <button
                    onClick={clearFilters}
                    style={{
                        padding: spacing.sm,
                        backgroundColor: colors.white,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.sm,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: colors.text
                    }}
                >
                    Ver Todos
                </button>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg }}>
                <MetricCard
                    title="Ingresos Totales"
                    value={`$${totalEarnings.toLocaleString('es-AR')}`}
                    color={colors.success} // Greenish for money
                />
                <MetricCard
                    title="Chocolates Vendidos"
                    value={totalItemsSold.toString()}
                    color={colors.primary}
                />
                <MetricCard
                    title="Pedidos Totales"
                    value={totalOrders.toString()}
                    color={colors.secondary}
                />
                <MetricCard
                    title="Ticket Promedio"
                    value={`$${averageTicket.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                    color={colors.textLight}
                />
            </div>

            <div style={{ marginTop: spacing.xl, color: colors.textLight, fontSize: typography.sizes.sm }}>
                * Los pedidos cancelados no se incluyen en las estadísticas.
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
    <div style={{
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.sm,
        borderBottom: `4px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm
    }}>
        <div style={{ fontSize: typography.sizes.base, color: colors.textLight }}>{title}</div>
        <div style={{ fontSize: typography.sizes.xl, fontWeight: 'bold', color: colors.text }}>{value}</div>
    </div>
);

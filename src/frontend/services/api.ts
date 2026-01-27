export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const checkAuth = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('adminToken') === 'admin123'; // Hardcoded for prototype
};

export const login = (password: string): boolean => {
    if (password === 'admin123') {
        localStorage.setItem('adminToken', 'admin123');
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
};

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const createProduct = async (product: any) => {
    const res = await fetch(`${API_URL}/api/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
};

export const updateProduct = async (id: number, product: any) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
};

export const deleteProduct = async (id: number) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
};

// Orders API

export const createOrder = async (order: any) => {
    const res = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
};

export const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/api/orders/`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export const updateOrderStatus = async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
};

export const deleteOrder = async (id: string) => {
    const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
};

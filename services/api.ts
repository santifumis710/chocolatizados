export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const TOKEN_KEY = 'adminToken';

const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
};

export const checkAuth = (): boolean => !!getToken();

export const login = async (password: string): Promise<boolean> => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const { token } = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    return true;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/admin/login';
};

const adminFetch = async (url: string, init: RequestInit = {}) => {
    const token = getToken();
    const headers = new Headers(init.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    const res = await fetch(url, { ...init, headers });
    if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
        throw new Error('Unauthorized');
    }
    return res;
};

export const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/products/`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const createProduct = async (product: any) => {
    const res = await adminFetch(`${API_URL}/api/products/`, {
        method: 'POST',
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
};

export const updateProduct = async (id: number, product: any) => {
    const res = await adminFetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
};

export const deleteProduct = async (id: number) => {
    const res = await adminFetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
};

// Orders API

export const createOrder = async (order: any) => {
    const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
};

export const fetchOrders = async () => {
    const res = await adminFetch(`${API_URL}/api/orders/`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
};

export const updateOrderStatus = async (id: string, status: string) => {
    const res = await adminFetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
};

export const deleteOrder = async (id: string) => {
    const res = await adminFetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
};

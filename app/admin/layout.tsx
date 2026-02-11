"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuth } from '@/services/api';
import { colors } from '@/theme';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Allow access to login page without check
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        if (!checkAuth()) {
            router.push('/admin/login');
        } else {
            setAuthorized(true);
        }
    }, [pathname]);

    if (!authorized) return null; // or a loading spinner

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
            {children}
        </div>
    );
}

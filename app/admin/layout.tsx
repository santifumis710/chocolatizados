"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuth } from '@/services/api';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
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

    if (!authorized) return null;

    return <div className="bg-background min-h-screen">{children}</div>;
}

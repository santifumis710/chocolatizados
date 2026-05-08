"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const ok = await login(password);
            if (ok) {
                router.push('/admin');
            } else {
                setError('Contraseña incorrecta');
            }
        } catch {
            setError('No se pudo conectar al servidor');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-[400px]"
            >
                <h1 className="text-xl text-primary mb-6 text-center">Admin Login</h1>

                {error && (
                    <div className="bg-[#ffebee] text-[#c62828] p-2 rounded-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-textLight">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded border border-border text-base"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full p-4 bg-primary text-white border-none rounded text-base font-bold ${
                        submitting ? "opacity-60 cursor-wait" : "cursor-pointer"
                    }`}
                >
                    {submitting ? 'Ingresando…' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

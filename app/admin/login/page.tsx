"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';
import { colors, spacing, typography, borderRadius } from '@/theme';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            router.push('/admin');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            fontFamily: typography.fontFamily
        }}>
            <form onSubmit={handleSubmit} style={{
                backgroundColor: colors.white,
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: typography.sizes.xl,
                    color: colors.primary,
                    marginBottom: spacing.lg,
                    textAlign: 'center'
                }}>Admin Login</h1>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: spacing.sm,
                        borderRadius: borderRadius.sm,
                        marginBottom: spacing.md,
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: spacing.md }}>
                    <label style={{ display: 'block', marginBottom: spacing.xs, color: colors.textLight }}>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: spacing.sm,
                            borderRadius: borderRadius.md,
                            border: `1px solid ${colors.border}`,
                            fontSize: typography.sizes.base
                        }}
                    />
                </div>

                <button type="submit" style={{
                    width: '100%',
                    padding: spacing.md,
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    fontSize: typography.sizes.base,
                    fontWeight: 'bold'
                }}>
                    Ingresar
                </button>
            </form>
        </div>
    );
}

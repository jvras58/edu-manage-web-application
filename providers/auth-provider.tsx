'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { verifyAuthAction } from '@/modules/auth/actions/auth.actions';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await verifyAuthAction();
        setUser(user);
      } catch (error) {
        console.error('[AuthProvider] Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
}

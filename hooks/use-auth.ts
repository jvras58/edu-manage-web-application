'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { logoutAction } from '@/modules/auth/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function useAuth() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { logout: clearStore } = useAuthStore();

  const logout = async () => {
    startTransition(async () => {
      try {
        clearStore();

        await logoutAction();
      } catch (error) {
        console.error('[useAuth] Erro ao fazer logout:', error);
        router.push('/login');
      }
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isPending,
    logout,
    isAdmin: user?.role === 'admin',
    isProfessor: user?.role === 'professor',
  };
}

'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { logoutAction } from '@/modules/auth/actions/auth.actions'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

/**
 * Hook customizado para gerenciar autenticação
 * Combina Zustand store com Server Actions
 */
export function useAuth() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { logout: clearStore } = useAuthStore()

  const logout = async () => {
    startTransition(async () => {
      try {
        // Limpar store local primeiro para UX imediata
        clearStore()
        
        // Chamar server action para limpar cookie
        await logoutAction()
      } catch (error) {
        console.error('[useAuth] Erro ao fazer logout:', error)
        // Forçar redirect mesmo com erro
        router.push('/login')
      }
    })
  }

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isPending,
    logout,
    // Atalhos úteis
    isAdmin: user?.role === 'admin',
    isProfessor: user?.role === 'professor',
  }
}

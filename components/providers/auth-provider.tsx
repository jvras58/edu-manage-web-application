'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { verifyAuthAction } from '@/modules/auth/actions/auth.actions'

/**
 * Componente que sincroniza o estado de autenticação entre servidor e cliente
 * Usa o React 19 para melhor performance
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Verificar autenticação no servidor ao montar
    const checkAuth = async () => {
      try {
        const { user } = await verifyAuthAction()
        setUser(user)
      } catch (error) {
        console.error('[AuthProvider] Erro ao verificar autenticação:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, setLoading])

  return <>{children}</>
}

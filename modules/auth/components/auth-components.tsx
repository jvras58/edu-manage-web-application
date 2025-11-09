"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { loginAction } from "@/modules/auth/actions/auth.actions"
import { useAuthStore } from "@/lib/stores/auth-store"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const setUser = useAuthStore((state) => state.setUser)

  // React 19 useActionState hook
  const [state, formAction, isPending] = useActionState(loginAction, null)

  // Efeito para tratar resposta da action
  useEffect(() => {
    if (state?.success && state.user) {
      // Atualizar store global do Zustand
      setUser(state.user)

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${state.user.nome}`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } else if (state?.error) {
      toast({
        title: "Erro ao fazer login",
        description: state.error,
        variant: "destructive",
      })
    }
  }, [state, router, toast, setUser, onSuccess])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu.email@escola.com"
          required
          disabled={isPending}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={isPending}
          autoComplete="current-password"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500 text-center">{state.error}</p>
      )}

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}



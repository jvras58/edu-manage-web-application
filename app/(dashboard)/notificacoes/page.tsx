"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Bell, Check, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Notificacao {
  id: string
  tipo: "info" | "sucesso" | "alerta" | "erro"
  mensagem: string
  lida: boolean
  created_at: string
}

export default function NotificacoesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    fetchNotificacoes()
  }, [])

  const fetchNotificacoes = async () => {
    try {
      const response = await fetch("/api/notificacoes?limit=50")
      if (!response.ok) throw new Error("Erro ao carregar notificações")

      const data = await response.json()
      setNotificacoes(data.notificacoes)
    } catch (error) {
      toast({
        title: "Erro ao carregar notificações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLida = async (id: string) => {
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: "PATCH",
      })

      if (!response.ok) throw new Error("Erro ao marcar como lida")

      setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)))

      toast({
        title: "Notificação marcada como lida",
      })
    } catch (error) {
      toast({
        title: "Erro ao marcar notificação",
        variant: "destructive",
      })
    }
  }

  const deletarNotificacao = async (id: string) => {
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar")

      setNotificacoes((prev) => prev.filter((n) => n.id !== id))

      toast({
        title: "Notificação removida",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover notificação",
        variant: "destructive",
      })
    }
  }

  const getTipoBadge = (tipo: string) => {
    const variants = {
      info: "info",
      sucesso: "success",
      alerta: "warning",
      erro: "destructive",
    } as const

    return variants[tipo as keyof typeof variants] || "default"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        <p className="text-gray-600 mt-1">Acompanhe todas as atualizações e avisos do sistema</p>
      </div>

      {notificacoes.length === 0 ? (
        <EmptyState icon={Bell} title="Nenhuma notificação" description="Você não tem notificações no momento" />
      ) : (
        <div className="space-y-3">
          {notificacoes.map((notificacao) => (
            <Card key={notificacao.id} className={cn("p-4", !notificacao.lida && "bg-blue-50 border-blue-200")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getTipoBadge(notificacao.tipo)}>{notificacao.tipo}</Badge>
                    {!notificacao.lida && <span className="h-2 w-2 bg-blue-600 rounded-full" />}
                  </div>
                  <p className="text-gray-900">{notificacao.mensagem}</p>
                  <p className="text-xs text-gray-600">{new Date(notificacao.created_at).toLocaleString("pt-BR")}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!notificacao.lida && (
                    <Button variant="ghost" size="icon" onClick={() => marcarComoLida(notificacao.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deletarNotificacao(notificacao.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

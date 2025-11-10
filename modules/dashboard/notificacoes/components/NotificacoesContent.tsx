"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { NotificacoesList } from "./NotificacoesList"
import { Notificacao } from "../types/notificacoes.types"

export function NotificacoesContent() {
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <NotificacoesList
      notificacoes={notificacoes}
      onMarcarComoLida={marcarComoLida}
      onDeletar={deletarNotificacao}
    />
  )
}
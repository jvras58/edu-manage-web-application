"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Notificacao } from "@/modules/dashboard/notificacoes/types/notificacoes.types"

interface NotificacaoCardProps {
  notificacao: Notificacao
  onMarcarComoLida: (id: string) => void
  onDeletar: (id: string) => void
}

export function NotificacaoCard({ notificacao, onMarcarComoLida, onDeletar }: NotificacaoCardProps) {
  const getTipoBadge = (tipo: string) => {
    const variants = {
      info: "info",
      sucesso: "success",
      alerta: "warning",
      erro: "destructive",
    } as const

    return variants[tipo as keyof typeof variants] || "default"
  }

  return (
    <Card className={cn("p-4", !notificacao.lida && "bg-blue-50 border-blue-200")}>
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
            <Button variant="ghost" size="icon" onClick={() => onMarcarComoLida(notificacao.id)}>
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDeletar(notificacao.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
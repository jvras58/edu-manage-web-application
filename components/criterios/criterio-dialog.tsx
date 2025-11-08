"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Criterio {
  id: string
  nome: string
  peso: number
  descricao: string | null
}

interface CriterioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  criterio?: Criterio | null
  turmaId: string
  pesoDisponivel: number
  onSuccess: () => void
}

export function CriterioDialog({
  open,
  onOpenChange,
  criterio,
  turmaId,
  pesoDisponivel,
  onSuccess,
}: CriterioDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    peso: "",
    descricao: "",
  })

  useEffect(() => {
    if (criterio) {
      setFormData({
        nome: criterio.nome,
        peso: criterio.peso.toString(),
        descricao: criterio.descricao || "",
      })
    } else {
      setFormData({
        nome: "",
        peso: "",
        descricao: "",
      })
    }
  }, [criterio, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const peso = Number.parseFloat(formData.peso)

      if (isNaN(peso) || peso < 0 || peso > 100) {
        throw new Error("Peso deve ser um número entre 0 e 100")
      }

      if (!criterio && peso > pesoDisponivel) {
        throw new Error(`Peso excede o disponível. Máximo: ${pesoDisponivel.toFixed(0)}%`)
      }

      const url = criterio ? `/api/criterios/${criterio.id}` : `/api/turmas/${turmaId}/criterios`
      const method = criterio ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          peso,
          descricao: formData.descricao || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar critério")
      }

      toast({
        title: criterio ? "Critério atualizado!" : "Critério criado!",
        description: `O critério "${formData.nome}" foi ${criterio ? "atualizado" : "adicionado"} com sucesso.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao salvar critério",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{criterio ? "Editar Critério" : "Novo Critério"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Critério *</Label>
            <Input
              id="nome"
              placeholder="Ex: Provas, Trabalhos, Participação"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso">Peso (%) * {!criterio && `- Disponível: ${pesoDisponivel.toFixed(0)}%`}</Label>
            <Input
              id="peso"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="Ex: 30"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva como este critério será avaliado..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : criterio ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

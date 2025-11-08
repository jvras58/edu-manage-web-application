"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Turma {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
}

interface TurmaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  turma?: Turma | null
  onSuccess: () => void
}

export function TurmaDialog({ open, onOpenChange, turma, onSuccess }: TurmaDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    disciplina: "",
    ano_letivo: new Date().getFullYear().toString(),
  })

  useEffect(() => {
    if (turma) {
      setFormData({
        nome: turma.nome,
        disciplina: turma.disciplina,
        ano_letivo: turma.ano_letivo,
      })
    } else {
      setFormData({
        nome: "",
        disciplina: "",
        ano_letivo: new Date().getFullYear().toString(),
      })
    }
  }, [turma, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = turma ? `/api/turmas/${turma.id}` : "/api/turmas"
      const method = turma ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar turma")
      }

      toast({
        title: turma ? "Turma atualizada!" : "Turma criada!",
        description: `A turma "${formData.nome}" foi ${turma ? "atualizada" : "criada"} com sucesso.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao salvar turma",
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
          <DialogTitle>{turma ? "Editar Turma" : "Nova Turma"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Turma</Label>
            <Input
              id="nome"
              placeholder="Ex: Turma A - Manhã"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Input
              id="disciplina"
              placeholder="Ex: Matemática, Português, etc."
              value={formData.disciplina}
              onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano_letivo">Ano Letivo</Label>
            <Input
              id="ano_letivo"
              placeholder="2024"
              value={formData.ano_letivo}
              onChange={(e) => setFormData({ ...formData, ano_letivo: e.target.value })}
              required
              disabled={loading}
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
              ) : turma ? (
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

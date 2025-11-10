"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Aluno {
  id: string
  nome: string
  matricula: string
  email: string | null
  foto_url: string | null
  status: string
  turmas?: Array<{ turma_id: string }>
}

interface Turma {
  id: string
  nome: string
  disciplina: string
}

interface AlunoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  aluno?: Aluno | null
  turmas: Turma[]
  onSuccess: () => void
}

export function AlunoDialog({ open, onOpenChange, aluno, turmas, onSuccess }: AlunoDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    foto_url: "",
    status: "ativo",
    turma_ids: [] as string[],
  })

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email || "",
        foto_url: aluno.foto_url || "",
        status: aluno.status,
        turma_ids: aluno.turmas?.map((t) => t.turma_id) || [],
      })
    } else {
      setFormData({
        nome: "",
        matricula: "",
        email: "",
        foto_url: "",
        status: "ativo",
        turma_ids: [],
      })
    }
  }, [aluno, open])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const tempId = aluno?.id || "temp-" + Date.now()
      const response = await fetch(`/api/alunos/${tempId}/foto`, {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) throw new Error("Erro ao fazer upload")

      const data = await response.json()
      setFormData({ ...formData, foto_url: data.url })

      toast({
        title: "Foto enviada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar foto",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const toggleTurma = (turmaId: string) => {
    setFormData({
      ...formData,
      turma_ids: formData.turma_ids.includes(turmaId)
        ? formData.turma_ids.filter((id) => id !== turmaId)
        : [...formData.turma_ids, turmaId],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = aluno ? `/api/alunos/${aluno.id}` : "/api/alunos"
      const method = aluno ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar aluno")
      }

      toast({
        title: aluno ? "Aluno atualizado!" : "Aluno criado!",
        description: `${formData.nome} foi ${aluno ? "atualizado" : "cadastrado"} com sucesso.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao salvar aluno",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{aluno ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.foto_url || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                {formData.nome ? getInitials(formData.nome) : "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="foto" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>{uploading ? "Enviando..." : "Enviar foto"}</span>
                </div>
              </Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              {formData.foto_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, foto_url: "" })}
                  className="mt-1 text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover foto
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva Santos"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                placeholder="Ex: 2024001"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="aluno@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="trancado">Trancado</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <Label>Turmas</Label>
            <div className="flex flex-wrap gap-2">
              {turmas.map((turma) => (
                <Badge
                  key={turma.id}
                  variant={formData.turma_ids.includes(turma.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTurma(turma.id)}
                >
                  {turma.nome}
                </Badge>
              ))}
            </div>
            {turmas.length === 0 && (
              <p className="text-sm text-gray-600">Nenhuma turma disponível. Crie uma turma primeiro.</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading || uploading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : aluno ? (
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

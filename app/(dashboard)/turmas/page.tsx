"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, Search, BookOpen, Users, ClipboardList, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TurmaDialog } from "@/components/turmas/turma-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { ExportButton } from "@/components/ui/export-button"

interface Turma {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_alunos: number
  total_criterios: number
  created_at: string
}

export default function TurmasPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [deletingTurma, setDeletingTurma] = useState<Turma | null>(null)

  useEffect(() => {
    fetchTurmas()
  }, [])

  const fetchTurmas = async () => {
    try {
      const response = await fetch("/api/turmas")
      if (!response.ok) throw new Error("Erro ao carregar turmas")

      const data = await response.json()
      setTurmas(data.turmas)
    } catch (error) {
      toast({
        title: "Erro ao carregar turmas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTurma) return

    try {
      const response = await fetch(`/api/turmas/${deletingTurma.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar turma")

      toast({
        title: "Turma removida com sucesso",
      })

      fetchTurmas()
      setDeletingTurma(null)
    } catch (error) {
      toast({
        title: "Erro ao remover turma",
        variant: "destructive",
      })
    }
  }

  const filteredTurmas = turmas.filter(
    (turma) =>
      turma.nome.toLowerCase().includes(search.toLowerCase()) ||
      turma.disciplina.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas turmas e organize seus alunos</p>
        </div>
        <div className="flex gap-2">
          <ExportButton endpoint="/api/turmas/export" filename="turmas.csv" label="Exportar" />
          <Button
            onClick={() => {
              setEditingTurma(null)
              setDialogOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar turmas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Turmas */}
      {filteredTurmas.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma turma encontrada"
          description="Crie sua primeira turma para começar a organizar seus alunos"
          action={{
            label: "Criar Turma",
            onClick: () => setDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTurmas.map((turma) => (
            <Card key={turma.id} className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{turma.nome}</h3>
                  <Badge variant="info">{turma.ano_letivo}</Badge>
                </div>
                <p className="text-gray-600">{turma.disciplina}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{(turma.total_alunos)} alunos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ClipboardList className="h-4 w-4" />
                  <span>{(turma.total_criterios)} critérios</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/turmas/${turma.id}`}>Ver Detalhes</Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingTurma(turma)
                    setDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeletingTurma(turma)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <TurmaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        turma={editingTurma}
        onSuccess={() => {
          fetchTurmas()
          setDialogOpen(false)
        }}
      />

      {/* Dialog Confirmar Exclusão */}
      <AlertDialog open={!!deletingTurma} onOpenChange={() => setDeletingTurma(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma "{deletingTurma?.nome}"? Esta ação não pode ser desfeita e removerá
              todos os vínculos com alunos e critérios de avaliação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

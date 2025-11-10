"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { AlunoDialog } from "@/components/alunos/aluno-dialog"
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
import { AlunosHeader, AlunosFilters, AlunosList } from "@/modules/dashboard/alunos/components/aluno-components"
import { Aluno, Turma } from "@/modules/dashboard/alunos/schemas/aluno.schema"

export default function AlunosPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [turmaFilter, setTurmaFilter] = useState("todas")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [deletingAluno, setDeletingAluno] = useState<Aluno | null>(null)

  useEffect(() => {
    fetchData()
  }, [statusFilter, turmaFilter])

  const fetchData = async () => {
    try {
      // Buscar alunos
      let alunosUrl = "/api/alunos?"
      if (statusFilter !== "todos") {
        alunosUrl += `status=${statusFilter}&`
      }
      if (turmaFilter !== "todas") {
        alunosUrl += `turma_id=${turmaFilter}&`
      }

      const [alunosRes, turmasRes] = await Promise.all([fetch(alunosUrl), fetch("/api/turmas")])

      if (!alunosRes.ok || !turmasRes.ok) {
        throw new Error("Erro ao carregar dados")
      }

      const alunosData = await alunosRes.json()
      const turmasData = await turmasRes.json()

      setAlunos(alunosData.alunos)
      setTurmas(turmasData.turmas)
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingAluno) return

    try {
      const response = await fetch(`/api/alunos/${deletingAluno.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar aluno")

      toast({
        title: "Aluno removido com sucesso",
      })

      fetchData()
      setDeletingAluno(null)
    } catch (error) {
      toast({
        title: "Erro ao remover aluno",
        variant: "destructive",
      })
    }
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(search.toLowerCase()),
  )

  const handleNovoAluno = () => {
    setEditingAluno(null)
    setDialogOpen(true)
  }

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setDialogOpen(true)
  }

  const handleDeleteClick = (aluno: Aluno) => {
    setDeletingAluno(aluno)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AlunosHeader
        onNovoAluno={handleNovoAluno}
        statusFilter={statusFilter}
        turmaFilter={turmaFilter}
      />

      {/* Filters */}
      <AlunosFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        turmaFilter={turmaFilter}
        onTurmaFilterChange={setTurmaFilter}
        turmas={turmas}
      />

      {/* Lista de Alunos */}
      <AlunosList
        alunos={filteredAlunos}
        onNovoAluno={handleNovoAluno}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Dialog Criar/Editar */}
      <AlunoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        aluno={editingAluno}
        turmas={turmas}
        onSuccess={() => {
          fetchData()
          setDialogOpen(false)
        }}
      />

      {/* Dialog Confirmar Exclusão */}
      <AlertDialog open={!!deletingAluno} onOpenChange={() => setDeletingAluno(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o aluno "{deletingAluno?.nome}"? Esta ação não pode ser desfeita e removerá
              todos os vínculos com turmas.
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

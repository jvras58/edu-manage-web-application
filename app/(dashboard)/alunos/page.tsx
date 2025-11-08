"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, Search, Users, Pencil, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExportButton } from "@/components/ui/export-button"

interface Aluno {
  id: string
  nome: string
  matricula: string
  email: string | null
  foto_url: string | null
  status: string
  turmas: Array<{
    turma_id: string
    turma_nome: string
    turma_disciplina: string
  }>
}

interface Turma {
  id: string
  nome: string
  disciplina: string
}

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

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "success",
      inativo: "warning",
      trancado: "destructive",
    } as const

    return variants[status as keyof typeof variants] || "default"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os seus alunos e suas informações</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            endpoint="/api/alunos/export"
            filename="alunos.csv"
            params={{
              ...(statusFilter !== "todos" && { status: statusFilter }),
              ...(turmaFilter !== "todas" && { turmaId: turmaFilter }),
            }}
            label="Exportar"
          />
          <Button
            onClick={() => {
              setEditingAluno(null)
              setDialogOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar alunos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="trancado">Trancado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={turmaFilter} onValueChange={setTurmaFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as turmas</SelectItem>
            {turmas.map((turma) => (
              <SelectItem key={turma.id} value={turma.id}>
                {turma.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Alunos */}
      {filteredAlunos.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum aluno encontrado"
          description="Adicione alunos para começar a gerenciar suas turmas"
          action={{
            label: "Adicionar Aluno",
            onClick: () => setDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlunos.map((aluno) => (
            <Card key={aluno.id} className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={aluno.foto_url || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(aluno.nome)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{aluno.nome}</h3>
                  <p className="text-sm text-gray-600">{aluno.matricula}</p>
                  {aluno.email && <p className="text-sm text-gray-600 truncate">{aluno.email}</p>}
                </div>
                <Badge variant={getStatusBadge(aluno.status)}>{aluno.status}</Badge>
              </div>

              {/* Turmas */}
              {aluno.turmas && aluno.turmas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {aluno.turmas.map((turma, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {turma.turma_nome}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setEditingAluno(aluno)
                    setDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeletingAluno(aluno)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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

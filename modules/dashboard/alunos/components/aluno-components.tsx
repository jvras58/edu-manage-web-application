"use client"

import { Button } from "@/components/ui/button"
import { ExportButton } from "@/components/ui/export-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Turma, Aluno } from "../schemas/aluno.schema"

interface AlunosHeaderProps {
  onNovoAluno: () => void
  statusFilter: string
  turmaFilter: string
}

export function AlunosHeader({ onNovoAluno, statusFilter, turmaFilter }: AlunosHeaderProps) {
  return (
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
          onClick={onNovoAluno}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>
    </div>
  )
}

interface AlunosFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  turmaFilter: string
  onTurmaFilterChange: (value: string) => void
  turmas: Turma[]
}

export function AlunosFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  turmaFilter,
  onTurmaFilterChange,
  turmas,
}: AlunosFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar alunos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
      <Select value={turmaFilter} onValueChange={onTurmaFilterChange}>
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
  )
}

interface AlunoCardProps {
  aluno: Aluno
  onEdit: (aluno: Aluno) => void
  onDelete: (aluno: Aluno) => void
}

export function AlunoCard({ aluno, onEdit, onDelete }: AlunoCardProps) {
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

  return (
    <Card className="p-6 space-y-4">
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
          onClick={() => onEdit(aluno)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(aluno)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </Card>
  )
}

import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"

interface AlunosListProps {
  alunos: Aluno[]
  onNovoAluno: () => void
  onEdit: (aluno: Aluno) => void
  onDelete: (aluno: Aluno) => void
}

export function AlunosList({ alunos, onNovoAluno, onEdit, onDelete }: AlunosListProps) {
  if (alunos.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum aluno encontrado"
        description="Adicione alunos para começar a gerenciar suas turmas"
        action={{
          label: "Adicionar Aluno",
          onClick: onNovoAluno,
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alunos.map((aluno) => (
        <AlunoCard
          key={aluno.id}
          aluno={aluno}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

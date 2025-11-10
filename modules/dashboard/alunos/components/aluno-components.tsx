"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
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
import { AlunosHeader } from "./AlunosHeader"
import { AlunosFilters } from "./AlunosFilters"
import { AlunosList } from "./AlunosList"
import { useAlunos } from "../providers/alunos-provider"

export function AlunosDashboard() {
  const {
    loading,
    turmas,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    turmaFilter,
    setTurmaFilter,
    dialogOpen,
    setDialogOpen,
    editingAluno,
    deletingAluno,
    setDeletingAluno,
    fetchData,
    handleDelete,
    filteredAlunos,
    handleNovoAluno,
    handleEdit,
    handleDeleteClick,
  } = useAlunos()

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
"use client"

import { EmptyState } from "@/components/ui/empty-state"
import { BookOpen } from "lucide-react"
import { TurmaCard } from "./TurmaCard"
import { Turma } from "../types/turmas.types"

interface TurmasListProps {
  turmas: Turma[]
  onEdit: (turma: Turma) => void
  onDelete: (turma: Turma) => void
  onCreate: () => void
}

export function TurmasList({ turmas, onEdit, onDelete, onCreate }: TurmasListProps) {
  if (turmas.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Nenhuma turma encontrada"
        description="Crie sua primeira turma para começar a organizar seus alunos"
        action={{
          label: "Criar Turma",
          onClick: onCreate,
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {turmas.map((turma) => (
        <TurmaCard
          key={turma.id}
          turma={turma}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
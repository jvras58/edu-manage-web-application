"use client"

import { EmptyState } from "@/components/ui/empty-state"
import { ClipboardList } from "lucide-react"
import { CriterioCard } from "./CriterioCard"
import { useCriteriosTurma } from "@/modules/dashboard/criterios/providers/CriteriosTurmaProvider"

export function CriteriosTurmaList() {
  const {
    criterios,
    setDialogOpen,
    setEditingCriterio,
    setDeletingCriterio
  } = useCriteriosTurma()

  const handleEdit = (criterio: any) => {
    setEditingCriterio(criterio)
    setDialogOpen(true)
  }

  const handleDelete = (criterio: any) => {
    setDeletingCriterio(criterio)
  }

  if (criterios.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Nenhum critério configurado"
        description="Adicione critérios de avaliação para esta turma"
        action={{
          label: "Adicionar Critério",
          onClick: () => setDialogOpen(true),
        }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {criterios.map((criterio) => (
        <CriterioCard
          key={criterio.id}
          criterio={criterio}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
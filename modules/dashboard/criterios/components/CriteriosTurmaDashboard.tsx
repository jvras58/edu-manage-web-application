"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CriterioDialog } from "@/components/criterios/criterio-dialog"
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
import { CriteriosTurmaHeader } from "@/modules/dashboard/criterios/components/CriteriosTurmaHeader"
import { CriteriosPesoCard } from "@/modules/dashboard/criterios/components/CriteriosPesoCard"
import { CriteriosTurmaList } from "@/modules/dashboard/criterios/components/CriteriosTurmaList"
import { useCriteriosTurma } from "@/modules/dashboard/criterios/providers/CriteriosTurmaProvider"

interface CriteriosTurmaDashboardProps {
  turmaId: string
}

export function CriteriosTurmaDashboard({ turmaId }: CriteriosTurmaDashboardProps) {
  const {
    loading,
    turma,
    dialogOpen,
    setDialogOpen,
    editingCriterio,
    deletingCriterio,
    setDeletingCriterio,
    handleDelete,
    fetchCriterios,
    pesoDisponivel,
  } = useCriteriosTurma()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!turma) {
    return null
  }

  return (
    <div className="space-y-6">
        
      <CriteriosTurmaHeader />


      <CriteriosPesoCard />

      <CriteriosTurmaList />

      <CriterioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        criterio={editingCriterio}
        turmaId={turmaId}
        pesoDisponivel={
          editingCriterio ? pesoDisponivel + Number.parseFloat(editingCriterio.peso.toString()) : pesoDisponivel
        }
        onSuccess={() => {
          fetchCriterios()
          setDialogOpen(false)
        }}
      />


      <AlertDialog open={!!deletingCriterio} onOpenChange={() => setDeletingCriterio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o critério "{deletingCriterio?.nome}"? Esta ação não pode ser desfeita.
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
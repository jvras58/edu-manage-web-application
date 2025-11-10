"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Criterio, TurmaCriterios } from "../types/criterios.types"

interface CriteriosTurmaContextType {
  loading: boolean
  turma: TurmaCriterios | null
  criterios: Criterio[]
  somaPesos: number
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  editingCriterio: Criterio | null
  setEditingCriterio: (criterio: Criterio | null) => void
  deletingCriterio: Criterio | null
  setDeletingCriterio: (criterio: Criterio | null) => void
  fetchCriterios: () => Promise<void>
  handleDelete: () => Promise<void>
  pesoDisponivel: number
}

const CriteriosTurmaContext = createContext<CriteriosTurmaContextType | undefined>(undefined)

export function CriteriosTurmaProvider({
  children,
  turmaId
}: {
  children: ReactNode
  turmaId: string
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState<TurmaCriterios | null>(null)
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [somaPesos, setSomaPesos] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCriterio, setEditingCriterio] = useState<Criterio | null>(null)
  const [deletingCriterio, setDeletingCriterio] = useState<Criterio | null>(null)

  const fetchCriterios = async () => {
    try {
      const response = await fetch(`/api/turmas/${turmaId}/criterios`)
      if (!response.ok) throw new Error("Erro ao carregar critérios")

      const data = await response.json()
      setTurma(data.turma)
      setCriterios(data.criterios)
      setSomaPesos(data.somaPesos)
    } catch (error) {
      toast({
        title: "Erro ao carregar critérios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCriterio) return

    try {
      const response = await fetch(`/api/criterios/${deletingCriterio.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar critério")

      toast({
        title: "Critério removido com sucesso",
      })

      fetchCriterios()
      setDeletingCriterio(null)
    } catch (error) {
      toast({
        title: "Erro ao remover critério",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCriterios()
  }, [turmaId])

  const pesoDisponivel = 100 - somaPesos

  return (
    <CriteriosTurmaContext.Provider value={{
      loading,
      turma,
      criterios,
      somaPesos,
      dialogOpen,
      setDialogOpen,
      editingCriterio,
      setEditingCriterio,
      deletingCriterio,
      setDeletingCriterio,
      fetchCriterios,
      handleDelete,
      pesoDisponivel,
    }}>
      {children}
    </CriteriosTurmaContext.Provider>
  )
}

export function useCriteriosTurma() {
  const context = useContext(CriteriosTurmaContext)
  if (context === undefined) {
    throw new Error("useCriteriosTurma must be used within a CriteriosTurmaProvider")
  }
  return context
}
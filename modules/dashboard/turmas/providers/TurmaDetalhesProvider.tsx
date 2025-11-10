"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Turma, Aluno, Criterio } from "../types/turmas.types"

interface TurmaDetalhesContextType {
  loading: boolean
  turma: Turma | null
  alunos: Aluno[]
  criterios: Criterio[]
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  fetchTurmaDetalhes: () => Promise<void>
}

const TurmaDetalhesContext = createContext<TurmaDetalhesContextType | undefined>(undefined)

export function TurmaDetalhesProvider({
  children,
  turmaId
}: {
  children: ReactNode
  turmaId: string
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState<Turma | null>(null)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchTurmaDetalhes = async () => {
    try {
      const response = await fetch(`/api/turmas/${turmaId}`)
      if (!response.ok) throw new Error("Erro ao carregar turma")

      const data = await response.json()
      setTurma(data.turma)
      setAlunos(data.alunos)
      setCriterios(data.criterios)
    } catch (error) {
      toast({
        title: "Erro ao carregar turma",
        variant: "destructive",
      })
      router.push("/turmas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTurmaDetalhes()
  }, [turmaId])

  return (
    <TurmaDetalhesContext.Provider value={{
      loading,
      turma,
      alunos,
      criterios,
      editDialogOpen,
      setEditDialogOpen,
      fetchTurmaDetalhes,
    }}>
      {children}
    </TurmaDetalhesContext.Provider>
  )
}

export function useTurmaDetalhes() {
  const context = useContext(TurmaDetalhesContext)
  if (context === undefined) {
    throw new Error("useTurmaDetalhes must be used within a TurmaDetalhesProvider")
  }
  return context
}
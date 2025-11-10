"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Turma } from "../types/criterios.types"


interface CriteriosContextType {
  loading: boolean
  turmas: Turma[]
  fetchTurmas: () => Promise<void>
}



const CriteriosContext = createContext<CriteriosContextType | undefined>(undefined)

export function CriteriosProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [turmas, setTurmas] = useState<Turma[]>([])

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

  useEffect(() => {
    fetchTurmas()
  }, [])

  return (
    <CriteriosContext.Provider value={{ loading, turmas, fetchTurmas }}>
      {children}
    </CriteriosContext.Provider>
  )
}

export function useCriterios() {
  const context = useContext(CriteriosContext)
  if (context === undefined) {
    throw new Error("useCriterios must be used within a CriteriosProvider")
  }
  return context
}
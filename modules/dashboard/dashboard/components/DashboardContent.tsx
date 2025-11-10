"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { DashboardStatsCards } from "./DashboardStatsCards"
import { DashboardAlunosStatus } from "./DashboardAlunosStatus"
import { DashboardTurmasRecentes } from "./DashboardTurmasRecentes"
import { DashboardStats, AlunosPorStatus, TurmaRecente } from "../types/dashboard.types"

export function DashboardContent() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [alunosPorStatus, setAlunosPorStatus] = useState<AlunosPorStatus[]>([])
  const [turmasRecentes, setTurmasRecentes] = useState<TurmaRecente[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (!response.ok) throw new Error("Erro ao carregar estatísticas")

        const data = await response.json()
        setStats(data.stats)
        setAlunosPorStatus(data.alunosPorStatus)
        setTurmasRecentes(data.turmasRecentes)
      } catch (error) {
        toast({
          title: "Erro ao carregar dashboard",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {stats && <DashboardStatsCards stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardAlunosStatus alunosPorStatus={alunosPorStatus} />
        <DashboardTurmasRecentes turmasRecentes={turmasRecentes} />
      </div>
    </>
  )
}
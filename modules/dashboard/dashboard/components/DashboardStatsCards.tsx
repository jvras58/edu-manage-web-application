"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Users, BookOpen, ClipboardList, Bell } from "lucide-react"
import { DashboardStats } from "@/modules/dashboard/dashboard/types/dashboard.types"

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total de Alunos" value={stats.totalAlunos} icon={Users} />
      <StatsCard title="Total de Turmas" value={stats.totalTurmas} icon={BookOpen} />
      <StatsCard title="Critérios Configurados" value={stats.totalCriterios} icon={ClipboardList} />
      <StatsCard title="Notificações" value={stats.notificacoesNaoLidas} icon={Bell} />
    </div>
  )
}
"use client"

import { useTurmaDetalhes } from "../providers/TurmaDetalhesProvider"
import { TurmaDetalhesHeader } from "./TurmaDetalhesHeader"
import { TurmaStatsCards } from "./TurmaStatsCards"
import { TurmaAlunosList } from "./TurmaAlunosList"
import { TurmaCriteriosList } from "./TurmaCriteriosList"

export function TurmaDetalhesContent() {
  const { loading } = useTurmaDetalhes()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TurmaDetalhesHeader />
      <TurmaStatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TurmaAlunosList />
        <TurmaCriteriosList />
      </div>
    </div>
  )
}
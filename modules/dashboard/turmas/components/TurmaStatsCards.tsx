"use client"

import { Card } from "@/components/ui/card"
import { Users, ClipboardList } from "lucide-react"
import { useTurmaDetalhes } from "../providers/TurmaDetalhesProvider"

export function TurmaStatsCards() {
  const { turma } = useTurmaDetalhes()

  if (!turma) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Alunos</p>
            <p className="text-2xl font-bold text-gray-900">{turma.total_alunos || 0}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <ClipboardList className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Critérios Configurados</p>
            <p className="text-2xl font-bold text-gray-900">{turma.total_criterios || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
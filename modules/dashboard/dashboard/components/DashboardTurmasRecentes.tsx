"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TurmaRecente } from "@/modules/dashboard/dashboard/types/dashboard.types"

interface DashboardTurmasRecentesProps {
  turmasRecentes: TurmaRecente[]
}

export function DashboardTurmasRecentes({ turmasRecentes }: DashboardTurmasRecentesProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Turmas Recentes</h2>
      <div className="space-y-3">
        {turmasRecentes.length > 0 ? (
          turmasRecentes.map((turma) => (
            <div key={turma.id} className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{turma.nome}</h3>
                  <p className="text-sm text-gray-600">
                    {turma.disciplina} • {turma.ano_letivo}
                  </p>
                </div>
                <Badge variant="info">{turma.total_alunos} alunos</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 text-center py-4">Nenhuma turma cadastrada ainda</p>
        )}
      </div>
    </Card>
  )
}
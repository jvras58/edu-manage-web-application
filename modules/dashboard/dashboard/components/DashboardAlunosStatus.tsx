"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlunosPorStatus } from "@/modules/dashboard/dashboard/types/dashboard.types"

interface DashboardAlunosStatusProps {
  alunosPorStatus: AlunosPorStatus[]
}

export function DashboardAlunosStatus({ alunosPorStatus }: DashboardAlunosStatusProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "success",
      inativo: "warning",
      trancado: "destructive",
    } as const

    return variants[status as keyof typeof variants] || "default"
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Alunos por Status</h2>
      <div className="space-y-3">
        {alunosPorStatus.length > 0 ? (
          alunosPorStatus.map((item) => (
            <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
                <span className="text-sm text-gray-600">{item.total} alunos</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{item.total}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 text-center py-4">Nenhum aluno cadastrado ainda</p>
        )}
      </div>
    </Card>
  )
}
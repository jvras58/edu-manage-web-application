"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTurmaDetalhes } from "@/modules/dashboard/turmas/providers/TurmaDetalhesProvider"

export function TurmaAlunosList() {
  const { alunos } = useTurmaDetalhes()

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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Alunos</h2>
      {alunos.length === 0 ? (
        <p className="text-gray-600 text-center py-8">Nenhum aluno vinculado a esta turma ainda</p>
      ) : (
        <div className="space-y-2">
          {alunos.map((aluno) => (
            <div key={aluno.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{aluno.nome}</p>
                <p className="text-sm text-gray-600">Matrícula: {aluno.matricula}</p>
              </div>
              <Badge variant={getStatusBadge(aluno.status)}>{aluno.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTurmaDetalhes } from "../providers/TurmaDetalhesProvider"

export function TurmaCriteriosList() {
  const { criterios } = useTurmaDetalhes()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Critérios de Avaliação</h2>
        <Button variant="outline" size="sm">
          Adicionar Critério
        </Button>
      </div>
      {criterios.length === 0 ? (
        <p className="text-gray-600 text-center py-8">Nenhum critério de avaliação definido para esta turma</p>
      ) : (
        <div className="space-y-2">
          {criterios.map((criterio) => (
            <div key={criterio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{criterio.nome}</p>
                <p className="text-sm text-gray-600">{criterio.descricao || "Sem descrição"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Peso: {criterio.peso}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
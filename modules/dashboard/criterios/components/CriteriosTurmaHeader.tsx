"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useCriteriosTurma } from "../providers/CriteriosTurmaProvider"

export function CriteriosTurmaHeader() {
  const { turma, somaPesos, setDialogOpen, setEditingCriterio } = useCriteriosTurma()

  if (!turma) return null

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/criterios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Critérios de Avaliação</h1>
          <p className="text-gray-600 mt-1">{turma.nome}</p>
        </div>
      </div>
      <Button
        onClick={() => {
          setEditingCriterio(null)
          setDialogOpen(true)
        }}
        className="bg-blue-600 hover:bg-blue-700"
        disabled={somaPesos >= 100}
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Critério
      </Button>
    </div>
  )
}
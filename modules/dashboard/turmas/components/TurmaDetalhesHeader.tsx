"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { useTurmaDetalhes } from "../providers/TurmaDetalhesProvider"

export function TurmaDetalhesHeader() {
  const { turma, setEditDialogOpen } = useTurmaDetalhes()

  if (!turma) return null

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/turmas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{turma.nome}</h1>
            <Badge variant="info">{turma.ano_letivo}</Badge>
          </div>
          <p className="text-gray-600">{turma.disciplina}</p>
        </div>
      </div>
      <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
        <Pencil className="h-4 w-4 mr-2" />
        Editar
      </Button>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { ExportButton } from "@/components/ui/export-button"
import { Plus } from "lucide-react"

export function AlunosHeader({ onNovoAluno, statusFilter, turmaFilter }: { onNovoAluno: () => void; statusFilter: string; turmaFilter: string }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os seus alunos e suas informações</p>
      </div>
      <div className="flex gap-2">
        <ExportButton
          endpoint="/api/alunos/export"
          filename="alunos.csv"
          params={{
            ...(statusFilter !== "todos" && { status: statusFilter }),
            ...(turmaFilter !== "todas" && { turmaId: turmaFilter }),
          }}
          label="Exportar"
        />
        <Button
          onClick={onNovoAluno}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>
    </div>
  )
}
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExportButton } from "@/components/ui/export-button"
import { TurmasContent } from "@/modules/dashboard/turmas/components/TurmasContent"

export default function TurmasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas turmas e organize seus alunos</p>
        </div>
        <div className="flex gap-2">
          <ExportButton endpoint="/api/turmas/export" filename="turmas.csv" label="Exportar" />
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </div>
      </div>

      <TurmasContent />
    </div>
  )
}

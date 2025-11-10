import { CriteriosDashboard } from "@/modules/dashboard/criterios/components/CriteriosDashboard"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Critérios de Avaliação - Painel",
};

export default function CriteriosPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Critérios de Avaliação</h1>
          <p className="text-gray-600 mt-1">Configure os critérios de avaliação para cada turma</p>
        </div>
        <CriteriosDashboard />
      </div>
  )
}

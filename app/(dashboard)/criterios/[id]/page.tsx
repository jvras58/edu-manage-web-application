import { use } from "react"
import { CriteriosTurmaProvider } from "@/modules/dashboard/criterios/providers/CriteriosTurmaProvider"
import { CriteriosTurmaDashboard } from "@/modules/dashboard/criterios/components/CriteriosTurmaDashboard"

export default function GerenciarCriteriosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)

  return (
    <CriteriosTurmaProvider turmaId={resolvedParams.id}>
      <CriteriosTurmaDashboard turmaId={resolvedParams.id} />
    </CriteriosTurmaProvider>
  )
}

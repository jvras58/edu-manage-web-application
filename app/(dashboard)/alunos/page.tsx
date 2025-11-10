import { AlunosProvider } from "@/modules/dashboard/alunos/providers/alunos-provider"
import { AlunosDashboard } from "@/modules/dashboard/alunos/components/aluno-components"

export default function AlunosPage() {
  return (
    <AlunosProvider>
      <AlunosDashboard />
    </AlunosProvider>
  )
}
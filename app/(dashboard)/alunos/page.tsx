import { AlunosProvider, AlunosDashboard } from "@/modules/dashboard/alunos/components/aluno-components"

export default function AlunosPage() {
  return (
    <AlunosProvider>
      <AlunosDashboard />
    </AlunosProvider>
  )
}
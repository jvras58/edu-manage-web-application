import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"
import { Aluno } from "@/modules/dashboard/alunos/schemas/aluno.schema"
import { AlunoCard } from "@/modules/dashboard/alunos/components/AlunoCard"

export function AlunosList({ alunos, onNovoAluno, onEdit, onDelete }: { alunos: Aluno[]; onNovoAluno: () => void; onEdit: (aluno: Aluno) => void; onDelete: (aluno: Aluno) => void }) {
  if (alunos.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum aluno encontrado"
        description="Adicione alunos para começar a gerenciar suas turmas"
        action={{
          label: "Adicionar Aluno",
          onClick: onNovoAluno,
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alunos.map((aluno) => (
        <AlunoCard
          key={aluno.id}
          aluno={aluno}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
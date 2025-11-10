
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Turma } from "@/modules/dashboard/alunos/schemas/aluno.schema"

export function AlunosFilters({ search, onSearchChange, statusFilter, onStatusFilterChange, turmaFilter, onTurmaFilterChange, turmas }: { search: string; onSearchChange: (value: string) => void; statusFilter: string; onStatusFilterChange: (value: string) => void; turmaFilter: string; onTurmaFilterChange: (value: string) => void; turmas: Turma[] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar alunos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os status</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
          <SelectItem value="trancado">Trancado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={turmaFilter} onValueChange={onTurmaFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Turma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as turmas</SelectItem>
          {turmas.map((turma) => (
            <SelectItem key={turma.id} value={turma.id}>
              {turma.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
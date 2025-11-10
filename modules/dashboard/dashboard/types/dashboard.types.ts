export interface DashboardStats {
  totalTurmas: number
  totalAlunos: number
  totalCriterios: number
  notificacoesNaoLidas: number
}

export interface AlunosPorStatus {
  status: string
  total: number
}

export interface TurmaRecente {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_alunos: number
  created_at: string
}
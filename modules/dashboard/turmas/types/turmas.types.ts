export interface Turma {
  id: string;
  nome: string;
  disciplina: string;
  ano_letivo: string;
  total_alunos?: number;
  total_criterios?: number;
  created_at: string;
  updated_at: string;
}

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email?: string;
  foto_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Criterio {
  id: string;
  turma_id: string;
  nome: string;
  peso: number;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface TurmaStats {
  totalAlunos: number;
  alunosAtivos: number;
  totalCriterios: number;
}

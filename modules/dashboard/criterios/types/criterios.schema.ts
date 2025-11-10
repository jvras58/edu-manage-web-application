export interface Turma {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_criterios: number
}

export interface Criterio {
  id: string
  nome: string
  peso: number
  descricao: string | null
}

export interface TurmaCriterios {
  id: string
  nome: string
}
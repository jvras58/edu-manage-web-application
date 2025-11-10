import { z } from "zod"

// Schema para Turma
export const turmaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  disciplina: z.string(),
})

export type Turma = z.infer<typeof turmaSchema>

export const alunoSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  email: z.email("Email inválido").nullable().or(z.literal("")),
  foto_url: z.url().nullable().or(z.literal("")),
  status: z.enum(["ativo", "inativo", "trancado"]),
  turmas: z.array(z.object({
    turma_id: z.string(),
    turma_nome: z.string(),
    turma_disciplina: z.string(),
  })).default([]),
})

export type Aluno = z.infer<typeof alunoSchema>

export const alunosFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.enum(["todos", "ativo", "inativo", "trancado"]).default("todos"),
  turma_id: z.string().optional(),
})

export type AlunosFilters = z.infer<typeof alunosFiltersSchema>

export const createAlunoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  email: z.email("Email inválido").nullable().or(z.literal("")),
  foto_url: z.url().nullable().or(z.literal("")),
  status: z.enum(["ativo", "inativo", "trancado"]),
  turmas: z.array(z.string()).default([]),
})

export type CreateAlunoInput = z.infer<typeof createAlunoSchema>

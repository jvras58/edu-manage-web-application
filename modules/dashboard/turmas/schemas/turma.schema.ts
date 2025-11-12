import { z } from 'zod';

export const turmaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  disciplina: z.string().min(1, 'Disciplina é obrigatória'),
  ano_letivo: z.string().min(1, 'Ano letivo é obrigatório'),
});

export type CreateTurmaInput = z.infer<typeof turmaSchema>;
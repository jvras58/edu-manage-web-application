import { z } from 'zod';

export const criterioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  peso: z
    .number()
    .min(0, 'Peso deve ser maior ou igual a 0')
    .max(100, 'Peso deve ser menor ou igual a 100'),
  descricao: z.string().optional(),
});

export type FormData = z.infer<typeof criterioSchema>;
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z
      .string()
      .min(1, { message: 'Nome é obrigatório' })
      .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
      .trim(),
    email: z
      .string()
      .min(1, { message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' })
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, { message: 'Senha é obrigatória' })
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

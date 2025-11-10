'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { comparePassword } from '@/lib/password';
import { generateToken, type UserPayload } from '@/lib/auth';
import { loginSchema } from '../schemas/auth.schema';

type LoginFormState = {
  success?: boolean;
  error?: string;
  user?: UserPayload;
};

export async function loginAction(
  _prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const validatedFields = loginSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0].message,
      };
    }

    const { email, password } = validatedFields.data;

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return {
        success: false,
        error: 'Email ou senha incorretos',
      };
    }

    const senhaValida = await comparePassword(password, usuario.senha_hash);

    if (!senhaValida) {
      return {
        success: false,
        error: 'Email ou senha incorretos',
      };
    }

    const userPayload: UserPayload = {
      userId: usuario.id.toString(),
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role as 'admin' | 'professor',
    };

    const token = await generateToken(userPayload);

    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      user: userPayload,
    };
  } catch (error) {
    console.error('[loginAction] Erro:', error);
    return {
      success: false,
      error: 'Erro ao processar login. Tente novamente.',
    };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  redirect('/login');
}

export async function getCurrentUserAction(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { verifyToken } = await import('@/lib/auth');
    const user = await verifyToken(token);

    return user;
  } catch (error) {
    console.error('[getCurrentUserAction] Erro:', error);
    return null;
  }
}

/**
 * Server Action para verificar autenticação
 */
export async function verifyAuthAction(): Promise<{
  isAuthenticated: boolean;
  user: UserPayload | null;
}> {
  const user = await getCurrentUserAction();

  return {
    isAuthenticated: !!user,
    user,
  };
}

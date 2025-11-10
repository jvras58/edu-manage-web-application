import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { id } = await params;

    const notificacao = await prisma.notificacao.updateMany({
      where: {
        id,
        usuario_id: user.userId,
      },
      data: {
        lida: true,
      },
    });

    if (notificacao.count === 0) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    const updated = await prisma.notificacao.findUnique({
      where: { id },
    });

    return NextResponse.json({ notificacao: updated });
  } catch (error) {
    console.error('  Update notification error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { id } = await params;

    const result = await prisma.notificacao.deleteMany({
      where: {
        id,
        usuario_id: user.userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('  Delete notification error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar notificação' },
      { status: 500 }
    );
  }
}

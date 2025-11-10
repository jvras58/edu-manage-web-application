import { prisma } from '@/lib/db';

interface CreateNotificationParams {
  usuarioId: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  mensagem: string;
}

export async function createNotification({
  usuarioId,
  tipo,
  mensagem,
}: CreateNotificationParams) {
  try {
    await prisma.notificacao.create({
      data: {
        usuario_id: usuarioId,
        tipo,
        mensagem,
      },
    });
  } catch (error) {
    console.error('  Failed to create notification:', error);
  }
}

export async function notifyProfessoresInTurma(
  turmaId: string,
  tipo: string,
  mensagem: string
) {
  try {
    const professores = await prisma.professorTurma.findMany({
      where: { turma_id: turmaId },
      select: { professor_id: true },
    });

    for (const prof of professores) {
      await createNotification({
        usuarioId: prof.professor_id,
        tipo: tipo as any,
        mensagem,
      });
    }
  } catch (error) {
    console.error('  Failed to notify professors:', error);
  }
}

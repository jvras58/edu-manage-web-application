import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const turmas = await prisma.turma.findMany({
      where: {
        professor_turmas: {
          some: {
            professor_id: user.userId,
          },
        },
      },
      include: {
        aluno_turmas: {
          select: {
            aluno_id: true,
          },
        },
        criterios_avaliacao: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    const headers = [
      'Nome',
      'Disciplina',
      'Ano Letivo',
      'Total Alunos',
      'Total Critérios',
      'Data de Criação',
    ];
    const rows = turmas.map((turma) => [
      turma.nome,
      turma.disciplina,
      turma.ano_letivo,
      turma.aluno_turmas.length,
      turma.criterios_avaliacao.length,
      new Date(turma.created_at).toLocaleDateString('pt-BR'),
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.map((field) => `"${field}"`).join(',') + '\n';
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="turmas-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const turmaId = searchParams.get('turma_id') || '';
    const status = searchParams.get('status') || '';

    const alunos = await prisma.aluno.findMany({
      where: {
        aluno_turmas: {
          some: {
            turma: {
              professor_turmas: {
                some: {
                  professor_id: user.userId,
                },
              },
            },
          },
        },
        ...(search && {
          OR: [
            { nome: { contains: search, mode: 'insensitive' } },
            { matricula: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(turmaId && {
          aluno_turmas: {
            some: {
              turma_id: turmaId,
            },
          },
        }),
        ...(status && { status }),
      },
      include: {
        aluno_turmas: {
          include: {
            turma: {
              select: {
                id: true,
                nome: true,
                disciplina: true,
              },
            },
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    const alunosFormatted = alunos.map((aluno) => ({
      ...aluno,
      turmas: aluno.aluno_turmas.map((at) => ({
        turma_id: at.turma.id,
        turma_nome: at.turma.nome,
        turma_disciplina: at.turma.disciplina,
      })),
    }));

    return NextResponse.json({ alunos: alunosFormatted });
  } catch (error) {
    console.error('  Get alunos error:', error);
    return NextResponse.json(
      { error: 'Erro ao obter alunos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { nome, matricula, email, foto_url, status, turma_ids } = body;

    if (!nome || !matricula) {
      return NextResponse.json(
        { error: 'Nome e matrícula são obrigatórios' },
        { status: 400 }
      );
    }

    const existingAluno = await prisma.aluno.findUnique({
      where: { matricula },
    });

    if (existingAluno) {
      return NextResponse.json(
        { error: 'Matrícula já cadastrada' },
        { status: 409 }
      );
    }

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        matricula,
        email: email || null,
        foto_url: foto_url || null,
        status: status || 'ativo',
      },
    });

    if (turma_ids && Array.isArray(turma_ids) && turma_ids.length > 0) {
      for (const turmaId of turma_ids) {
        const turmaValida = await prisma.turma.findFirst({
          where: {
            id: turmaId,
            professor_turmas: {
              some: {
                professor_id: user.userId,
              },
            },
          },
        });

        if (turmaValida) {
          await prisma.alunoTurma.create({
            data: {
              aluno_id: aluno.id,
              turma_id: turmaId,
            },
          });

          await prisma.notificacao.create({
            data: {
              usuario_id: user.userId,
              tipo: 'info',
              mensagem: `Aluno "${nome}" foi adicionado à turma "${turmaValida.nome}".`,
            },
          });
        }
      }
    }

    return NextResponse.json({ aluno });
  } catch (error) {
    console.error('Create aluno error:', error);
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 });
  }
}

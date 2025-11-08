import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const totalTurmas = await prisma.professorTurma.count({
      where: { professor_id: user.userId },
    })

    const totalAlunos = await prisma.alunoTurma.count({
      where: {
        turma: {
          professor_turmas: {
            some: {
              professor_id: user.userId,
            },
          },
        },
      },
    })

    const totalCriterios = await prisma.criterioAvaliacao.count({
      where: {
        turma: {
          professor_turmas: {
            some: {
              professor_id: user.userId,
            },
          },
        },
      },
    })

    const notificacoesNaoLidas = await prisma.notificacao.count({
      where: {
        usuario_id: user.userId,
        lida: false,
      },
    })

    // Alunos por status
    const alunosPorStatus = await prisma.aluno.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
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
      },
    })

    // Turmas mais recentes
    const turmasRecentes = await prisma.turma.findMany({
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
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    })

    return NextResponse.json({
      stats: {
        totalTurmas,
        totalAlunos,
        totalCriterios,
        notificacoesNaoLidas,
      },
      alunosPorStatus: alunosPorStatus.map((item) => ({
        status: item.status,
        total: item._count.id,
      })),
      turmasRecentes: turmasRecentes.map((turma) => ({
        id: turma.id,
        nome: turma.nome,
        disciplina: turma.disciplina,
        ano_letivo: turma.ano_letivo,
        total_alunos: turma.aluno_turmas.length,
        created_at: turma.created_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    return NextResponse.json({ error: "Erro ao obter estatísticas" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: {
        aluno_turmas: {
          include: {
            turma: true,
          },
        },
      },
    })

    if (!aluno) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      aluno,
      turmas: aluno.aluno_turmas.map((at) => at.turma),
    })
  } catch (error) {
    console.error("[v0] Get aluno error:", error)
    return NextResponse.json({ error: "Erro ao obter aluno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { nome, matricula, email, foto_url, status, turma_ids } = body

    // Validação
    if (!nome || !matricula) {
      return NextResponse.json({ error: "Nome e matrícula são obrigatórios" }, { status: 400 })
    }

    // Verificar se matrícula já existe em outro aluno
    const existingAluno = await prisma.aluno.findFirst({
      where: {
        matricula,
        NOT: {
          id,
        },
      },
    })

    if (existingAluno) {
      return NextResponse.json({ error: "Matrícula já cadastrada para outro aluno" }, { status: 409 })
    }

    // Atualizar aluno
    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        nome,
        matricula,
        email: email || null,
        foto_url: foto_url || null,
        status: status || "ativo",
      },
    })

    // Atualizar associações com turmas
    if (turma_ids && Array.isArray(turma_ids)) {
      // Remover associações antigas
      await prisma.alunoTurma.deleteMany({
        where: { aluno_id: id },
      })

      // Adicionar novas associações
      for (const turmaId of turma_ids) {
        // Verificar se turma pertence ao professor
        const turmaValida = await prisma.turma.findFirst({
          where: {
            id: turmaId,
            professor_turmas: {
              some: {
                professor_id: user.userId,
              },
            },
          },
        })

        if (turmaValida) {
          await prisma.alunoTurma.create({
            data: {
              aluno_id: id,
              turma_id: turmaId,
            },
          })
        }
      }
    }

    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "info",
        mensagem: `Dados do aluno "${nome}" foram atualizados.`,
      },
    })

    return NextResponse.json({ aluno })
  } catch (error) {
    console.error("[v0] Update aluno error:", error)
    return NextResponse.json({ error: "Erro ao atualizar aluno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    // Buscar nome do aluno
    const aluno = await prisma.aluno.findUnique({
      where: { id },
    })

    if (!aluno) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 })
    }

    // Deletar aluno (cascata deleta relacionamentos)
    await prisma.aluno.delete({
      where: { id },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "alerta",
        mensagem: `Aluno "${aluno.nome}" foi removido.`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete aluno error:", error)
    return NextResponse.json({ error: "Erro ao deletar aluno" }, { status: 500 })
  }
}

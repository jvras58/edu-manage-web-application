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

    const turma = await prisma.turma.findFirst({
      where: {
        id,
        professor_turmas: {
          some: {
            professor_id: user.userId,
          },
        },
      },
      include: {
        aluno_turmas: {
          include: {
            aluno: true,
          },
        },
        criterios_avaliacao: true,
      },
    })

    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 })
    }

    return NextResponse.json({
      turma: {
        ...turma,
        total_alunos: turma.aluno_turmas.length,
        total_criterios: turma.criterios_avaliacao.length,
      },
      alunos: turma.aluno_turmas.map((at) => at.aluno),
      criterios: turma.criterios_avaliacao,
    })
  } catch (error) {
    console.error("  Get turma error:", error)
    return NextResponse.json({ error: "Erro ao obter turma" }, { status: 500 })
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
    const { nome, disciplina, ano_letivo } = body

    // Validação
    if (!nome || !disciplina || !ano_letivo) {
      return NextResponse.json({ error: "Nome, disciplina e ano letivo são obrigatórios" }, { status: 400 })
    }

    // Verificar se turma pertence ao professor
    const verificacao = await prisma.turma.findFirst({
      where: {
        id,
        professor_turmas: {
          some: {
            professor_id: user.userId,
          },
        },
      },
    })

    if (!verificacao) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 })
    }

    // Atualizar turma
    const turma = await prisma.turma.update({
      where: { id },
      data: {
        nome,
        disciplina,
        ano_letivo,
      },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "info",
        mensagem: `Turma "${nome}" atualizada com sucesso!`,
      },
    })

    return NextResponse.json({ turma })
  } catch (error) {
    console.error("  Update turma error:", error)
    return NextResponse.json({ error: "Erro ao atualizar turma" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    // Verificar se turma pertence ao professor
    const turma = await prisma.turma.findFirst({
      where: {
        id,
        professor_turmas: {
          some: {
            professor_id: user.userId,
          },
        },
      },
    })

    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 })
    }

    // Deletar turma (cascata deleta relacionamentos)
    await prisma.turma.delete({
      where: { id },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "alerta",
        mensagem: `Turma "${turma.nome}" foi removida.`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("  Delete turma error:", error)
    return NextResponse.json({ error: "Erro ao deletar turma" }, { status: 500 })
  }
}

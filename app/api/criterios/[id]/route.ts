import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { nome, peso, descricao } = body

    // Validação
    if (!nome || peso === undefined || peso === null) {
      return NextResponse.json({ error: "Nome e peso são obrigatórios" }, { status: 400 })
    }

    if (peso < 0 || peso > 100) {
      return NextResponse.json({ error: "Peso deve estar entre 0 e 100" }, { status: 400 })
    }

    // Buscar critério atual
    const criterioAtual = await prisma.criterioAvaliacao.findFirst({
      where: {
        id,
        turma: {
          professor_turmas: {
            some: {
              professor_id: user.userId,
            },
          },
        },
      },
      include: {
        turma: true,
      },
    })

    if (!criterioAtual) {
      return NextResponse.json({ error: "Critério não encontrado" }, { status: 404 })
    }

    // Verificar se nova soma dos pesos não ultrapassa 100
    const outrosCriterios = await prisma.criterioAvaliacao.findMany({
      where: {
        turma_id: criterioAtual.turma_id,
        NOT: {
          id,
        },
      },
    })

    const somaOutros = outrosCriterios.reduce((sum, c) => sum + Number(c.peso), 0)

    if (somaOutros + peso > 100) {
      return NextResponse.json(
        {
          error: `A soma dos pesos não pode ultrapassar 100%. Soma dos outros critérios: ${somaOutros}%. Máximo permitido: ${100 - somaOutros}%`,
        },
        { status: 400 },
      )
    }

    // Atualizar critério
    const criterio = await prisma.criterioAvaliacao.update({
      where: { id },
      data: {
        nome,
        peso,
        descricao: descricao || null,
      },
    })

    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "info",
        mensagem: `Critério "${nome}" atualizado na turma "${criterioAtual.turma.nome}".`,
      },
    })

    return NextResponse.json({ criterio })
  } catch (error) {
    console.error("[v0] Update criterio error:", error)
    return NextResponse.json({ error: "Erro ao atualizar critério" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    // Buscar critério
    const criterio = await prisma.criterioAvaliacao.findFirst({
      where: {
        id,
        turma: {
          professor_turmas: {
            some: {
              professor_id: user.userId,
            },
          },
        },
      },
      include: {
        turma: true,
      },
    })

    if (!criterio) {
      return NextResponse.json({ error: "Critério não encontrado" }, { status: 404 })
    }

    // Deletar critério
    await prisma.criterioAvaliacao.delete({
      where: { id },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "alerta",
        mensagem: `Critério "${criterio.nome}" removido da turma "${criterio.turma.nome}".`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete criterio error:", error)
    return NextResponse.json({ error: "Erro ao deletar critério" }, { status: 500 })
  }
}

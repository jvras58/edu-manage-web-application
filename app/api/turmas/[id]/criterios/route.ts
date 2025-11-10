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

    const criterios = await prisma.criterioAvaliacao.findMany({
      where: { turma_id: id },
      orderBy: { created_at: "asc" },
    })

    // Calcular soma dos pesos
    const somaPesos = criterios.reduce((sum, c) => sum + Number(c.peso), 0)

    return NextResponse.json({
      criterios,
      turma,
      somaPesos,
    })
  } catch (error) {
    console.error("  Get criterios error:", error)
    return NextResponse.json({ error: "Erro ao obter critérios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verificar se soma dos pesos não ultrapassa 100
    const criteriosExistentes = await prisma.criterioAvaliacao.findMany({
      where: { turma_id: id },
    })

    const somaAtual = criteriosExistentes.reduce((sum, c) => sum + Number(c.peso), 0)

    if (somaAtual + peso > 100) {
      return NextResponse.json(
        {
          error: `A soma dos pesos não pode ultrapassar 100%. Soma atual: ${somaAtual}%. Disponível: ${100 - somaAtual}%`,
        },
        { status: 400 },
      )
    }

    // Criar critério
    const criterio = await prisma.criterioAvaliacao.create({
      data: {
        turma_id: id,
        nome,
        peso,
        descricao: descricao || null,
      },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "sucesso",
        mensagem: `Critério "${nome}" adicionado à turma "${turma.nome}".`,
      },
    })

    return NextResponse.json({ criterio })
  } catch (error) {
    console.error("  Create criterio error:", error)
    return NextResponse.json({ error: "Erro ao criar critério" }, { status: 500 })
  }
}

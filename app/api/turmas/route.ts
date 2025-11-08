import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const disciplina = searchParams.get("disciplina") || ""
    const anoLetivo = searchParams.get("ano_letivo") || ""

    const turmas = await prisma.turma.findMany({
      where: {
        professor_turmas: {
          some: {
            professor_id: user.userId,
          },
        },
        ...(search && {
          OR: [
            { nome: { contains: search, mode: "insensitive" } },
            { disciplina: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(disciplina && { disciplina }),
        ...(anoLetivo && { ano_letivo: anoLetivo }),
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
        created_at: "desc",
      },
    })

    const turmasFormatted = turmas.map((turma) => ({
      ...turma,
      total_alunos: turma.aluno_turmas.length,
      total_criterios: turma.criterios_avaliacao.length,
    }))

    return NextResponse.json({ turmas: turmasFormatted })
  } catch (error) {
    console.error("[v0] Get turmas error:", error)
    return NextResponse.json({ error: "Erro ao obter turmas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nome, disciplina, ano_letivo } = body

    // Validação
    if (!nome || !disciplina || !ano_letivo) {
      return NextResponse.json({ error: "Nome, disciplina e ano letivo são obrigatórios" }, { status: 400 })
    }

    // Criar turma e associar professor
    const turma = await prisma.turma.create({
      data: {
        nome,
        disciplina,
        ano_letivo,
        professor_turmas: {
          create: {
            professor_id: user.userId,
          },
        },
      },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo: "sucesso",
        mensagem: `Turma "${nome}" criada com sucesso!`,
      },
    })

    return NextResponse.json({ turma })
  } catch (error) {
    console.error("[v0] Create turma error:", error)
    return NextResponse.json({ error: "Erro ao criar turma" }, { status: 500 })
  }
}

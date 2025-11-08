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
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const somenteNaoLidas = searchParams.get("nao_lidas") === "true"

    const notificacoes = await prisma.notificacao.findMany({
      where: {
        usuario_id: user.userId,
        ...(somenteNaoLidas && { lida: false }),
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.notificacao.count({
      where: {
        usuario_id: user.userId,
        ...(somenteNaoLidas && { lida: false }),
      },
    })

    return NextResponse.json({
      notificacoes,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[v0] Get notifications error:", error)
    return NextResponse.json({ error: "Erro ao obter notificações" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, mensagem } = body

    if (!tipo || !mensagem) {
      return NextResponse.json({ error: "Tipo e mensagem são obrigatórios" }, { status: 400 })
    }

    const notificacao = await prisma.notificacao.create({
      data: {
        usuario_id: user.userId,
        tipo,
        mensagem,
      },
    })

    return NextResponse.json({ notificacao })
  } catch (error) {
    console.error("[v0] Create notification error:", error)
    return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 })
  }
}

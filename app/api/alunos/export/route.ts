import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const turmaId = searchParams.get("turmaId")
    const status = searchParams.get("status")

    const alunos = await prisma.aluno.findMany({
      where: {
        ...(turmaId && {
          aluno_turmas: {
            some: {
              turma_id: turmaId,
            },
          },
        }),
        ...(status && { status }),
      },
      orderBy: {
        nome: "asc",
      },
    })

    // Gera CSV simples
    const headers = ["Nome", "Matrícula", "Email", "Status", "Data de Cadastro"]
    const rows = alunos.map((aluno) => [
      aluno.nome,
      aluno.matricula,
      aluno.email || "-",
      aluno.status,
      new Date(aluno.created_at).toLocaleDateString("pt-BR"),
    ])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.map((field) => `"${field}"`).join(",") + "\n"
    })

    // Retorna CSV
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="alunos-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: "Erro ao exportar dados" }, { status: 500 })
  }
}

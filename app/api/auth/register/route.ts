import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Apenas administradores podem criar usuários" }, { status: 403 })
    }

    const body = await request.json()
    const { nome, email, password, role } = body

    if (!nome || !email || !password || !role) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (role !== "professor" && role !== "admin") {
      return NextResponse.json({ error: 'Role inválida. Use "professor" ou "admin"' }, { status: 400 })
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    const senhaHash = await hashPassword(password)

    const newUser = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash: senhaHash,
        role,
      },
    })

    await prisma.notificacao.create({
      data: {
        usuario_id: newUser.id,
        tipo: "info",
        mensagem: "Bem-vindo ao EduManage! Sua conta foi criada com sucesso.",
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}

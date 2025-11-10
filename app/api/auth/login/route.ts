import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { comparePassword } from "@/lib/password"
import { generateToken, setTokenCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!usuario) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const senhaValida = await comparePassword(password, usuario.senha_hash)

    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const role = usuario.role as "admin" | "professor"
    if (role !== "admin" && role !== "professor") {
      return NextResponse.json({ error: "Tipo de usuário inválido" }, { status: 401 })
    }

    const token = await generateToken({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: role,
    })


    await setTokenCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error: any) {
    console.error("  Login error:", error)
    console.error("  Error message:", error?.message)
    console.error("  Error stack:", error?.stack)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}

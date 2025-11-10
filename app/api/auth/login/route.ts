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
      console.error("  JSON parse error:", parseError)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const { email, password } = body

    console.log("  Login attempt for email:", email)

    // Validação básica
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })

    console.log("  Found user:", usuario)

    if (!usuario) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    console.log("  Verifying password...")
    // Verifica a senha
    const senhaValida = await comparePassword(password, usuario.senha_hash)

    console.log("  Password valid:", senhaValida)

    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Valida e converte o role
    const role = usuario.role as "admin" | "professor"
    if (role !== "admin" && role !== "professor") {
      return NextResponse.json({ error: "Tipo de usuário inválido" }, { status: 401 })
    }

    // Gera token JWT
    const token = await generateToken({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: role,
    })

    // Define cookie
    await setTokenCookie(token)

    console.log("  Login successful for:", usuario.email)

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

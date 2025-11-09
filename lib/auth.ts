import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "edumanage-super-secret-key-change-in-production")

const JWT_EXPIRATION = "24h" // Token expira em 24 horas

export interface UserPayload {
  userId: string
  email: string
  nome: string
  role: "admin" | "professor"
}

// Gera um token JWT
export async function generateToken(payload: UserPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET)

  return token
}

// Verifica e decodifica um token JWT
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as UserPayload
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    return null
  }
}

// Obtém o token do cookie
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")
  return token?.value || null
}

// Define o token no cookie
export async function setTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })
}

// Remove o token do cookie
export async function clearTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

// Obtém o usuário atual a partir do token
export async function getCurrentUser(): Promise<UserPayload | null> {
  const token = await getTokenFromCookie()
  if (!token) return null

  return await verifyToken(token)
}

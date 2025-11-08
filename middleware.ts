import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/alunos", "/turmas", "/criterios", "/notificacoes"]

// Rotas apenas para admin
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Verifica se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Obtém o token do cookie
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    // Redireciona para login se não houver token
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Verifica o token
  const payload = await verifyToken(token)

  if (!payload) {
    // Token inválido, redireciona para login
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    const response = NextResponse.redirect(url)
    response.cookies.delete("auth-token")
    return response
  }

  // Verifica se é rota admin e usuário não é admin
  if (isAdminRoute && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
}

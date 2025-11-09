import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register']

// Rotas protegidas que exigem autenticação
const protectedRoutes = [
  '/dashboard',
  '/alunos',
  '/turmas',
  '/criterios',
  '/notificacoes',
]

// Rotas de API protegidas
const protectedApiRoutes = [
  '/api/alunos',
  '/api/turmas',
  '/api/criterios',
  '/api/notificacoes',
  '/api/dashboard',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // 2. Obter token do cookie
  const token = request.cookies.get('auth-token')?.value

  // 3. Se não há token e a rota é protegida, redirecionar para login
  if (!token && (isProtectedRoute || isProtectedApiRoute)) {
    if (isProtectedApiRoute) {
      // Para APIs, retornar 401
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    // Para páginas, redirecionar para login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Verificar validade do token
  if (token) {
    const user = await verifyToken(token)

    // Token inválido ou expirado
    if (!user) {
      // Limpar cookie inválido
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // 5. Se usuário está autenticado e tenta acessar rota pública, redirecionar para dashboard
    if (isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 6. Adicionar informações do usuário aos headers da requisição (opcional)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.userId)
    requestHeaders.set('x-user-email', user.email)
    requestHeaders.set('x-user-role', user.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

// Configurar rotas onde o middleware deve executar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)',
  ],
}

'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Shield, User } from 'lucide-react'

/**
 * Exemplo completo de uso do sistema de autenticação
 * 
 * Este componente demonstra:
 * - Como usar o hook useAuth
 * - Como acessar informações do usuário
 * - Como verificar permissões
 * - Como fazer logout
 * - Como lidar com loading states
 */
export default function AuthExamplePage() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    logout,
    isAdmin,
    isProfessor 
  } = useAuth()

  // Estado de loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você precisa estar autenticado para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Usuário autenticado
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exemplo de Autenticação</h1>
        <Button onClick={logout} variant="outline">
          Sair
        </Button>
      </div>

      {/* Card de Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
          <CardDescription>
            Dados obtidos do store Zustand com persistência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{user.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-mono text-sm">{user.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Função</p>
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verificação de Permissões
          </CardTitle>
          <CardDescription>
            Exemplo de como verificar roles do usuário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conteúdo para Administradores */}
          {isAdmin && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔑 Área do Administrador
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Este conteúdo só é visível para administradores. Você tem acesso
                total ao sistema.
              </p>
              <div className="mt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  Gerenciar Usuários
                </Button>
                <Button className="w-full" variant="outline">
                  Configurações do Sistema
                </Button>
                <Button className="w-full" variant="outline">
                  Relatórios Administrativos
                </Button>
              </div>
            </div>
          )}

          {/* Conteúdo para Professores */}
          {isProfessor && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                👨‍🏫 Área do Professor
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Este conteúdo é visível para professores. Você pode gerenciar suas
                turmas e alunos.
              </p>
              <div className="mt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  Minhas Turmas
                </Button>
                <Button className="w-full" variant="outline">
                  Meus Alunos
                </Button>
                <Button className="w-full" variant="outline">
                  Critérios de Avaliação
                </Button>
              </div>
            </div>
          )}

          {/* Conteúdo Comum */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2">
              📚 Conteúdo Comum
            </h3>
            <p className="text-sm text-muted-foreground">
              Este conteúdo é visível para todos os usuários autenticados,
              independente do role.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card de Recursos */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Recursos Implementados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              React 19 - useActionState para formulários
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Next.js Server Actions - sem rotas API
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Zustand com persist - estado global
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Middleware - proteção automática de rotas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              JWT Tokens - autenticação segura
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Cookies httpOnly - segurança contra XSS
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Type-safe - TypeScript em toda stack
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Card de Exemplos de Código */}
      <Card>
        <CardHeader>
          <CardTitle>💻 Exemplos de Código</CardTitle>
          <CardDescription>
            Como usar o hook useAuth em seus componentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs">
{`import { useAuth } from '@/hooks/use-auth'

export function MeuComponente() {
  const { 
    user,           // Dados do usuário
    isAuthenticated,// true/false
    isLoading,      // estado de carregamento
    logout,         // função de logout
    isAdmin,        // atalho para role
    isProfessor     // atalho para role
  } = useAuth()

  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Login />

  return (
    <div>
      <h1>Olá, {user.nome}!</h1>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Sair</button>
    </div>
  )
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

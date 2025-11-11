import Link from "next/link"
import { GraduationCap, BookOpen, Users, BarChart3, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduManage</span>
          </div>
          <Link href="/login">
            <Button>Acessar Sistema</Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="mx-auto" variant="secondary">
            Sistema de Gestão Educacional
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-balance">
            Gerencie sua escola com{" "}
            <span className="bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              eficiência e simplicidade
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            EduManage é a plataforma completa para professores e administradores gerenciarem alunos, turmas e critérios
            de avaliação em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Funcionalidades Principais</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar sua instituição de ensino de forma moderna e eficiente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 p-3 rounded-lg w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Gestão de Alunos</h3>
              <p className="text-muted-foreground">
                Cadastre, edite e organize todos os alunos com fotos, matrículas e status. Associe alunos a múltiplas
                turmas facilmente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-chart-1/10 p-3 rounded-lg w-fit">
                <BookOpen className="h-6 w-6 text-chart-1" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Controle de Turmas</h3>
              <p className="text-muted-foreground">
                Crie e gerencie turmas por disciplina e ano letivo. Atribua professores e acompanhe o desempenho em
                tempo real.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-chart-2/10 p-3 rounded-lg w-fit">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Critérios de Avaliação</h3>
              <p className="text-muted-foreground">
                Configure critérios personalizados por turma com pesos e descrições. Validação automática de
                distribuição de notas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-chart-3/10 p-3 rounded-lg w-fit">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Segurança JWT</h3>
              <p className="text-muted-foreground">
                Autenticação robusta com tokens JWT e controle de acesso por roles (Admin e Professor).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-chart-4/10 p-3 rounded-lg w-fit">
                <Zap className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Notificações em Tempo Real</h3>
              <p className="text-muted-foreground">
                Receba alertas automáticos sobre novas inclusões, atualizações e ações importantes no sistema.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="bg-chart-5/10 p-3 rounded-lg w-fit">
                <CheckCircle2 className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Exportação de Dados</h3>
              <p className="text-muted-foreground">
                Exporte relatórios de alunos e turmas em CSV para análise e compartilhamento externo.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Teste Gratuitamente
                </Badge>
                <h2 className="text-3xl font-bold text-foreground">Usuários de Demonstração</h2>
                <p className="text-muted-foreground">
                  Experimente o sistema com estas contas de teste. Todos os recursos estão disponíveis!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-3 p-6 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Conta Administrador</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="bg-background px-2 py-1 rounded mt-1 font-mono">admin@edumanage.com</code>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Senha:</span>
                      <code className="bg-background px-2 py-1 rounded mt-1 font-mono">123456</code>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Acesso completo: criar professores, gerenciar todas as turmas e alunos.
                  </p>
                </div>

                <div className="space-y-3 p-6 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-chart-1" />
                    <h3 className="font-semibold text-lg text-foreground">Conta Professor</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="bg-background px-2 py-1 rounded mt-1 font-mono">maria.silva@edumanage.com</code>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Senha:</span>
                      <code className="bg-background px-2 py-1 rounded mt-1 font-mono">123456</code>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    Gerenciar turmas atribuídas, alunos e critérios de avaliação.
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Fazer Login Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Pronto para transformar sua gestão educacional?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Junte-se a centenas de instituições que já usam o EduManage para facilitar o dia a dia escolar.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="mt-4">
                Começar Gratuitamente
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 EduManage. Sistema de Gestão Educacional.</p>
        </div>
      </footer>
    </div>
  )
}

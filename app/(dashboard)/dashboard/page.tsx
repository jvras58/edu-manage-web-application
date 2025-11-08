"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Users, BookOpen, ClipboardList, Bell } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalTurmas: number
  totalAlunos: number
  totalCriterios: number
  notificacoesNaoLidas: number
}

interface AlunosPorStatus {
  status: string
  total: number
}

interface TurmaRecente {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_alunos: number
  created_at: string
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [alunosPorStatus, setAlunosPorStatus] = useState<AlunosPorStatus[]>([])
  const [turmasRecentes, setTurmasRecentes] = useState<TurmaRecente[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (!response.ok) throw new Error("Erro ao carregar estatísticas")

        const data = await response.json()
        setStats(data.stats)
        setAlunosPorStatus(data.alunosPorStatus)
        setTurmasRecentes(data.turmasRecentes)
      } catch (error) {
        toast({
          title: "Erro ao carregar dashboard",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading) {
    return <LoadingSpinner />
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "success",
      inativo: "warning",
      trancado: "destructive",
    } as const

    return variants[status as keyof typeof variants] || "default"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao EduManage</h1>
        <p className="text-gray-600 mt-1">Gerencie suas turmas, alunos e avaliações de forma simples e eficiente</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total de Alunos" value={stats.totalAlunos} icon={Users} />
          <StatsCard title="Total de Turmas" value={stats.totalTurmas} icon={BookOpen} />
          <StatsCard title="Critérios Configurados" value={stats.totalCriterios} icon={ClipboardList} />
          <StatsCard title="Notificações" value={stats.notificacoesNaoLidas} icon={Bell} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alunos por Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alunos por Status</h2>
          <div className="space-y-3">
            {alunosPorStatus.length > 0 ? (
              alunosPorStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
                    <span className="text-sm text-gray-600">{Number.parseInt(item.total)} alunos</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{Number.parseInt(item.total)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">Nenhum aluno cadastrado ainda</p>
            )}
          </div>
        </Card>

        {/* Turmas Recentes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Turmas Recentes</h2>
          <div className="space-y-3">
            {turmasRecentes.length > 0 ? (
              turmasRecentes.map((turma) => (
                <div key={turma.id} className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{turma.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {turma.disciplina} • {turma.ano_letivo}
                      </p>
                    </div>
                    <Badge variant="info">{Number.parseInt(turma.total_alunos)} alunos</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">Nenhuma turma cadastrada ainda</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

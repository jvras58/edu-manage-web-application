"use client"

import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, Users, ClipboardList, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TurmaDialog } from "@/components/turmas/turma-dialog"

interface Turma {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_alunos: number
  total_criterios: number
}

interface Aluno {
  id: string
  nome: string
  matricula: string
  email: string | null
  status: string
}

interface Criterio {
  id: string
  nome: string
  peso: number
  descricao: string | null
}

export default function TurmaDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState<Turma | null>(null)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchTurmaDetalhes()
  }, [resolvedParams.id])

  const fetchTurmaDetalhes = async () => {
    try {
      const response = await fetch(`/api/turmas/${resolvedParams.id}`)
      if (!response.ok) throw new Error("Erro ao carregar turma")

      const data = await response.json()
      setTurma(data.turma)
      setAlunos(data.alunos)
      setCriterios(data.criterios)
    } catch (error) {
      toast({
        title: "Erro ao carregar turma",
        variant: "destructive",
      })
      router.push("/turmas")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "success",
      inativo: "warning",
      trancado: "destructive",
    } as const

    return variants[status as keyof typeof variants] || "default"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!turma) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/turmas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{turma.nome}</h1>
              <Badge variant="info">{turma.ano_letivo}</Badge>
            </div>
            <p className="text-gray-600">{turma.disciplina}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900">{(turma.total_alunos)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critérios Configurados</p>
              <p className="text-2xl font-bold text-gray-900">{(turma.total_criterios)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alunos */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alunos</h2>
        {alunos.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum aluno vinculado a esta turma ainda</p>
        ) : (
          <div className="space-y-2">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{aluno.nome}</p>
                  <p className="text-sm text-gray-600">Matrícula: {aluno.matricula}</p>
                </div>
                <Badge variant={getStatusBadge(aluno.status)}>{aluno.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Critérios */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Critérios de Avaliação</h2>
        {criterios.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum critério configurado para esta turma</p>
        ) : (
          <div className="space-y-2">
            {criterios.map((criterio) => (
              <div key={criterio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{criterio.nome}</p>
                  {criterio.descricao && <p className="text-sm text-gray-600">{criterio.descricao}</p>}
                </div>
                <Badge>{(criterio.peso).toFixed(0)}%</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dialog Editar */}
      <TurmaDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        turma={turma}
        onSuccess={() => {
          fetchTurmaDetalhes()
          setEditDialogOpen(false)
        }}
      />
    </div>
  )
}

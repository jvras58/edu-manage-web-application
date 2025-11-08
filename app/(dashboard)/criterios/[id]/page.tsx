"use client"

import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ArrowLeft, Plus, ClipboardList, Pencil, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CriterioDialog } from "@/components/criterios/criterio-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Criterio {
  id: string
  nome: string
  peso: number
  descricao: string | null
}

interface Turma {
  id: string
  nome: string
}

export default function GerenciarCriteriosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [turma, setTurma] = useState<Turma | null>(null)
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [somaPesos, setSomaPesos] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCriterio, setEditingCriterio] = useState<Criterio | null>(null)
  const [deletingCriterio, setDeletingCriterio] = useState<Criterio | null>(null)

  useEffect(() => {
    fetchCriterios()
  }, [resolvedParams.id])

  const fetchCriterios = async () => {
    try {
      const response = await fetch(`/api/turmas/${resolvedParams.id}/criterios`)
      if (!response.ok) throw new Error("Erro ao carregar critérios")

      const data = await response.json()
      setTurma(data.turma)
      setCriterios(data.criterios)
      setSomaPesos(data.somaPesos)
    } catch (error) {
      toast({
        title: "Erro ao carregar critérios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCriterio) return

    try {
      const response = await fetch(`/api/criterios/${deletingCriterio.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar critério")

      toast({
        title: "Critério removido com sucesso",
      })

      fetchCriterios()
      setDeletingCriterio(null)
    } catch (error) {
      toast({
        title: "Erro ao remover critério",
        variant: "destructive",
      })
    }
  }

  const pesoDisponivel = 100 - somaPesos

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
            <Link href="/criterios">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Critérios de Avaliação</h1>
            <p className="text-gray-600 mt-1">{turma.nome}</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingCriterio(null)
            setDialogOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={somaPesos >= 100}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Critério
        </Button>
      </div>

      {/* Peso Total */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Distribuição de Pesos</h2>
          <Badge variant={somaPesos === 100 ? "success" : somaPesos > 100 ? "destructive" : "warning"}>
            {somaPesos.toFixed(0)}% de 100%
          </Badge>
        </div>

        <Progress value={somaPesos} className="h-3" />

        {somaPesos < 100 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ainda faltam {pesoDisponivel.toFixed(0)}% para completar 100%. Adicione mais critérios ou ajuste os pesos
              existentes.
            </AlertDescription>
          </Alert>
        )}

        {somaPesos === 100 && (
          <Alert className="border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Perfeito! A soma dos pesos está em 100%.</AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Lista de Critérios */}
      {criterios.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhum critério configurado"
          description="Adicione critérios de avaliação para esta turma"
          action={{
            label: "Adicionar Critério",
            onClick: () => setDialogOpen(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {criterios.map((criterio) => (
            <Card key={criterio.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{criterio.nome}</h3>
                    <Badge>{Number.parseFloat(criterio.peso.toString()).toFixed(0)}%</Badge>
                  </div>
                  {criterio.descricao && <p className="text-sm text-gray-600">{criterio.descricao}</p>}
                  <Progress value={Number.parseFloat(criterio.peso.toString())} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingCriterio(criterio)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDeletingCriterio(criterio)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Criar/Editar */}
      <CriterioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        criterio={editingCriterio}
        turmaId={resolvedParams.id}
        pesoDisponivel={
          editingCriterio ? pesoDisponivel + Number.parseFloat(editingCriterio.peso.toString()) : pesoDisponivel
        }
        onSuccess={() => {
          fetchCriterios()
          setDialogOpen(false)
        }}
      />

      {/* Dialog Confirmar Exclusão */}
      <AlertDialog open={!!deletingCriterio} onOpenChange={() => setDeletingCriterio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o critério "{deletingCriterio?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

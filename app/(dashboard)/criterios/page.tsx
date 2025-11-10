"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ClipboardList, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Turma {
  id: string
  nome: string
  disciplina: string
  ano_letivo: string
  total_criterios: number
}

export default function CriteriosPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [turmas, setTurmas] = useState<Turma[]>([])

  useEffect(() => {
    fetchTurmas()
  }, [])

  const fetchTurmas = async () => {
    try {
      const response = await fetch("/api/turmas")
      if (!response.ok) throw new Error("Erro ao carregar turmas")

      const data = await response.json()
      setTurmas(data.turmas)
    } catch (error) {
      toast({
        title: "Erro ao carregar turmas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Critérios de Avaliação</h1>
        <p className="text-gray-600 mt-1">Configure os critérios de avaliação para cada turma</p>
      </div>

      {turmas.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma turma encontrada"
          description="Crie turmas primeiro para configurar critérios de avaliação"
          action={{
            label: "Ir para Turmas",
            onClick: () => (window.location.href = "/turmas"),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.map((turma) => (
            <Card key={turma.id} className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{turma.nome}</h3>
                <p className="text-sm text-gray-600">{turma.disciplina}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipboardList className="h-4 w-4" />
                <span>{turma.total_criterios} critérios configurados</span>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/criterios/${turma.id}`}>Gerenciar Critérios</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

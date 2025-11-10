"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Aluno } from "../schemas/aluno.schema"

interface AlunoCardProps {
  aluno: Aluno
  onEdit: (aluno: Aluno) => void
  onDelete: (aluno: Aluno) => void
}

export function AlunoCard({ aluno, onEdit, onDelete }: AlunoCardProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "success",
      inativo: "warning",
      trancado: "warning",
    } as const

    return variants[status as keyof typeof variants] || "default"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={aluno.foto_url || undefined} />
          <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(aluno.nome)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{aluno.nome}</h3>
          <p className="text-sm text-gray-600">{aluno.matricula}</p>
          {aluno.email && <p className="text-sm text-gray-600 truncate">{aluno.email}</p>}
        </div>
        <Badge variant={getStatusBadge(aluno.status)}>{aluno.status}</Badge>
      </div>

      {/* Turmas */}
      {aluno.turmas && aluno.turmas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {aluno.turmas.map((turma, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {turma.turma_nome}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={() => onEdit(aluno)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(aluno)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </Card>
  )
}
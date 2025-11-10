"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Aluno, Turma } from "../schemas/aluno.schema"

interface AlunosContextType {
  loading: boolean
  alunos: Aluno[]
  turmas: Turma[]
  search: string
  setSearch: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  turmaFilter: string
  setTurmaFilter: (value: string) => void
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
  editingAluno: Aluno | null
  setEditingAluno: (value: Aluno | null) => void
  deletingAluno: Aluno | null
  setDeletingAluno: (value: Aluno | null) => void
  fetchData: () => Promise<void>
  handleDelete: () => Promise<void>
  filteredAlunos: Aluno[]
  handleNovoAluno: () => void
  handleEdit: (aluno: Aluno) => void
  handleDeleteClick: (aluno: Aluno) => void
}

const AlunosContext = createContext<AlunosContextType | undefined>(undefined)

export function AlunosProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [turmaFilter, setTurmaFilter] = useState("todas")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [deletingAluno, setDeletingAluno] = useState<Aluno | null>(null)

  useEffect(() => {
    fetchData()
  }, [statusFilter, turmaFilter])

  const fetchData = async () => {
    try {
      let alunosUrl = "/api/alunos?"
      if (statusFilter !== "todos") {
        alunosUrl += `status=${statusFilter}&`
      }
      if (turmaFilter !== "todas") {
        alunosUrl += `turma_id=${turmaFilter}&`
      }

      const [alunosRes, turmasRes] = await Promise.all([fetch(alunosUrl), fetch("/api/turmas")])

      if (!alunosRes.ok || !turmasRes.ok) {
        throw new Error("Erro ao carregar dados")
      }

      const alunosData = await alunosRes.json()
      const turmasData = await turmasRes.json()

      setAlunos(alunosData.alunos)
      setTurmas(turmasData.turmas)
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingAluno) return

    try {
      const response = await fetch(`/api/alunos/${deletingAluno.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar aluno")

      toast({
        title: "Aluno removido com sucesso",
      })

      fetchData()
      setDeletingAluno(null)
    } catch (error) {
      toast({
        title: "Erro ao remover aluno",
        variant: "destructive",
      })
    }
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(search.toLowerCase()),
  )

  const handleNovoAluno = () => {
    setEditingAluno(null)
    setDialogOpen(true)
  }

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setDialogOpen(true)
  }

  const handleDeleteClick = (aluno: Aluno) => {
    setDeletingAluno(aluno)
  }

  return (
    <AlunosContext.Provider
      value={{
        loading,
        alunos,
        turmas,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        turmaFilter,
        setTurmaFilter,
        dialogOpen,
        setDialogOpen,
        editingAluno,
        setEditingAluno,
        deletingAluno,
        setDeletingAluno,
        fetchData,
        handleDelete,
        filteredAlunos,
        handleNovoAluno,
        handleEdit,
        handleDeleteClick,
      }}
    >
      {children}
    </AlunosContext.Provider>
  )
}

export function useAlunos() {
  const context = useContext(AlunosContext)
  if (!context) {
    throw new Error("useAlunos must be used within an AlunosProvider")
  }
  return context
}
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, Loader2 } from "lucide-react"
import { loginSchema, type LoginFormData } from "@/modules/auth/schemas/auth.schema"
import { z } from "zod"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Resposta inválida do servidor")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login")
      }

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${data.user.nome}`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("[LoginForm] Login error:", error)
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Limpa o erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu.email@escola.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          disabled={loading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
          disabled={loading}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}

export function LoginHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <div className="bg-blue-600 p-3 rounded-xl">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">EduManage</h1>
      <p className="text-gray-600 text-balance">Portal do Professor</p>
    </div>
  )
}

export function LoginDemoInfo() {
  return (
    <div className="pt-4 border-t text-center space-y-2">
      <p className="text-sm text-gray-600">Contas de demonstração:</p>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Admin: admin@edumanage.com</p>
        <p>Professor: maria.silva@edumanage.com</p>
        <p className="font-medium">Senha: 123456</p>
      </div>
    </div>
  )
}

export function LoginFooter() {
  return <p className="text-center text-sm text-gray-600 mt-6">Sistema de Gestão Educacional</p>
}

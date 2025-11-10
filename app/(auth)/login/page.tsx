import { GraduationCap } from "lucide-react"
import { LoginForm } from "@/modules/auth/components/auth-components"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-blue-600 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">EduManage</h1>
            <p className="text-gray-600 text-balance">Portal do Professor</p>
          </div>
          <LoginForm />

          <div className="pt-4 border-t text-center space-y-2">
            <p className="text-sm text-gray-600">Contas de demonstração:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Admin: admin@edumanage.com</p>
              <p>Professor: maria.silva@edumanage.com</p>
              <p className="font-medium">Senha: 123456</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">Sistema de Gestão Educacional</p>
        </div>

      </div>
    </div>
  )
}

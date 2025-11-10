import { DashboardContent } from "@/modules/dashboard/dashboard/components/DashboardContent"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao EduManage</h1>
        <p className="text-gray-600 mt-1">Gerencie suas turmas, alunos e avaliações de forma simples e eficiente</p>
      </div>

      <DashboardContent />
    </div>
  )
}

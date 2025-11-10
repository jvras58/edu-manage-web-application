
import { AlunosDashboard } from "@/modules/dashboard/alunos/components/AlunoDashboard"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alunos - Dashboard",
};

export default function AlunosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os seus alunos e suas informações</p>
      </div>
      <AlunosDashboard />
    </div>
  )
}
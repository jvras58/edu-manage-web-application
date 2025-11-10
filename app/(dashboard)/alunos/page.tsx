
import { AlunosDashboard } from "@/modules/dashboard/alunos/components/AlunoDashboard"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alunos - Dashboard",
};

export default function AlunosPage() {
  return (
      <AlunosDashboard />
  )
}
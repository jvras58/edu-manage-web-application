import { TurmasDashboard } from '@/modules/dashboard/turmas/components/TurmasDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turmas - Painel',
};

export default function TurmasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Turmas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas turmas e organize seus alunos
        </p>
      </div>
      <TurmasDashboard />
    </div>
  );
}

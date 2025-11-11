import { NotificacoesContent } from '@/modules/dashboard/notificacoes/components/NotificacoesContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificações - Painel',
};

export default function NotificacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as atualizações e avisos do sistema
        </p>
      </div>

      <NotificacoesContent />
    </div>
  );
}

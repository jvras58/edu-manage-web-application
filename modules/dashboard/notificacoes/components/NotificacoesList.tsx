'use client';

import { EmptyState } from '@/components/ui/empty-state';
import { Bell } from 'lucide-react';
import { NotificacaoCard } from '@/modules/dashboard/notificacoes/components/NotificacaoCard';
import { Notificacao } from '@/modules/dashboard/notificacoes/types/notificacoes.types';

interface NotificacoesListProps {
  notificacoes: Notificacao[];
  onMarcarComoLida: (id: string) => void;
  onDeletar: (id: string) => void;
}

export function NotificacoesList({
  notificacoes,
  onMarcarComoLida,
  onDeletar,
}: NotificacoesListProps) {
  if (notificacoes.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Nenhuma notificação"
        description="Você não tem notificações no momento"
      />
    );
  }

  return (
    <div className="space-y-3">
      {notificacoes.map((notificacao) => (
        <NotificacaoCard
          key={notificacao.id}
          notificacao={notificacao}
          onMarcarComoLida={onMarcarComoLida}
          onDeletar={onDeletar}
        />
      ))}
    </div>
  );
}

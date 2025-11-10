import { use } from 'react';
import { TurmaDetalhesProvider } from '@/modules/dashboard/turmas/providers/TurmaDetalhesProvider';
import { TurmaDetalhesContent } from '@/modules/dashboard/turmas/components/TurmaDetalhesContent';

export default function TurmaDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <TurmaDetalhesProvider turmaId={resolvedParams.id}>
      <TurmaDetalhesContent />
    </TurmaDetalhesProvider>
  );
}

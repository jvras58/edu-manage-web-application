'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { TurmaDialog } from '@/components/turmas/turma-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TurmasSearch } from '@/modules/dashboard/turmas/components/TurmasSearch';
import { TurmasList } from '@/modules/dashboard/turmas/components/TurmasList';
import { Turma } from '@/modules/dashboard/turmas/types/turmas.types';

export function TurmasContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [deletingTurma, setDeletingTurma] = useState<Turma | null>(null);

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const response = await fetch('/api/turmas');
      if (!response.ok) throw new Error('Erro ao carregar turmas');

      const data = await response.json();
      setTurmas(data.turmas);
    } catch (error) {
      toast({
        title: 'Erro ao carregar turmas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTurma) return;

    try {
      const response = await fetch(`/api/turmas/${deletingTurma.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar turma');

      toast({
        title: 'Turma removida com sucesso',
      });

      fetchTurmas();
      setDeletingTurma(null);
    } catch (error) {
      toast({
        title: 'Erro ao remover turma',
        variant: 'destructive',
      });
    }
  };

  const filteredTurmas = turmas.filter(
    (turma) =>
      turma.nome.toLowerCase().includes(search.toLowerCase()) ||
      turma.disciplina.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingTurma(null);
    setDialogOpen(true);
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setDialogOpen(true);
  };

  const handleDeleteClick = (turma: Turma) => {
    setDeletingTurma(turma);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <TurmasSearch search={search} onSearchChange={setSearch} />

      <TurmasList
        turmas={filteredTurmas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
      />

      <TurmaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        turma={editingTurma}
        onSuccess={() => {
          fetchTurmas();
          setDialogOpen(false);
        }}
      />

      <AlertDialog
        open={!!deletingTurma}
        onOpenChange={() => setDeletingTurma(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma "{deletingTurma?.nome}"?
              Esta ação não pode ser desfeita e removerá todos os vínculos com
              alunos e critérios de avaliação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

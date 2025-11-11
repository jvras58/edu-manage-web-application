'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CriterioDialog } from '@/components/criterios/criterio-dialog';
import { useCriteriosTurma } from '@/modules/dashboard/criterios/providers/CriteriosTurmaProvider';
import { useTurmaDetalhes } from '@/modules/dashboard/turmas/providers/TurmaDetalhesProvider';
import { Edit, Trash2 } from 'lucide-react';
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

export function TurmaCriteriosList() {
  const {
    criterios,
    setDialogOpen,
    dialogOpen,
    editingCriterio,
    setEditingCriterio,
    setDeletingCriterio,
    deletingCriterio,
    handleDelete,
    fetchCriterios,
    pesoDisponivel,
  } = useCriteriosTurma();
  const { turma } = useTurmaDetalhes();

  const handleEdit = (criterio: any) => {
    setEditingCriterio(criterio);
    setDialogOpen(true);
  };

  const handleDeleteClick = (criterio: any) => {
    setDeletingCriterio(criterio);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Critérios de Avaliação
        </h2>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          Adicionar Critério
        </Button>
      </div>
      {criterios.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          Nenhum critério de avaliação definido para esta turma
        </p>
      ) : (
        <div className="space-y-2">
          {criterios.map((criterio) => (
            <div
              key={criterio.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{criterio.nome}</p>
                <p className="text-sm text-gray-600">
                  {criterio.descricao || 'Sem descrição'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Peso: {criterio.peso}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(criterio)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(criterio)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <CriterioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        criterio={editingCriterio}
        turmaId={turma?.id || ''}
        pesoDisponivel={
          editingCriterio
            ? pesoDisponivel + editingCriterio.peso
            : pesoDisponivel
        }
        onSuccess={() => {
          fetchCriterios();
          setDialogOpen(false);
        }}
      />
      <AlertDialog
        open={!!deletingCriterio}
        onOpenChange={() => setDeletingCriterio(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o critério "
              {deletingCriterio?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

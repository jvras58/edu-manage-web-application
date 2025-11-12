'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GenericDialog, GenericDialogConfig } from '@/components/generic-dialog';
import { turmaSchema } from '@/modules/dashboard/turmas/schemas/turma.schema';
import { useToast } from '@/hooks/use-toast';

interface Turma {
  id: string;
  nome: string;
  disciplina: string;
  ano_letivo: string;
}

interface TurmaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turma?: Turma | null;
  onSuccess: () => void;
}

export function TurmaDialog({
  open,
  onOpenChange,
  turma,
  onSuccess,
}: TurmaDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = turma ? `/api/turmas/${turma.id}` : '/api/turmas';
      const method = turma ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar turma');
      }

      return response.json();
    },
    onSuccess: (_, data) => {
      toast({
        title: turma ? 'Turma atualizada!' : 'Turma criada!',
        description: `A turma "${data.nome}" foi ${turma ? 'atualizada' : 'criada'} com sucesso.`,
      });
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar turma',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const config: GenericDialogConfig = {
    title: turma ? 'Editar Turma' : 'Nova Turma',
    schema: turmaSchema,
    fields: [
      {
        name: 'nome',
        label: 'Nome da Turma',
        type: 'text',
        required: true,
        placeholder: 'Ex: Turma A - Manhã',
      },
      {
        name: 'disciplina',
        label: 'Disciplina',
        type: 'text',
        required: true,
        placeholder: 'Ex: Matemática, Português, etc.',
      },
      {
        name: 'ano_letivo',
        label: 'Ano Letivo',
        type: 'text',
        required: true,
        placeholder: new Date().getFullYear().toString(),
      },
    ],
    defaultValues: {
      nome: '',
      disciplina: '',
      ano_letivo: new Date().getFullYear().toString(),
    },
    maxWidth: '500px',
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericDialog
      open={open}
      onOpenChange={onOpenChange}
      config={config}
      initialData={turma ? {
        nome: turma.nome,
        disciplina: turma.disciplina,
        ano_letivo: turma.ano_letivo,
      } : null}
      isEdit={!!turma}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

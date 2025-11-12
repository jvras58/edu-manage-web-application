'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GenericDialog, GenericDialogConfig } from '@/components/generic-dialog';
import { criterioSchema } from '@/modules/dashboard/criterios/schemas/criterio.schema';
import { useToast } from '@/hooks/use-toast';
interface Criterio {
  id: string;
  nome: string;
  peso: number;
  descricao: string | null;
}

interface CriterioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criterio?: Criterio | null;
  turmaId: string;
  pesoDisponivel: number;
  onSuccess: () => void;
}

export function CriterioDialog({
  open,
  onOpenChange,
  criterio,
  turmaId,
  pesoDisponivel,
  onSuccess,
}: CriterioDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!criterio && data.peso > pesoDisponivel) {
        throw new Error(`Peso excede o disponível. Máximo: ${pesoDisponivel.toFixed(0)}%`);
      }

      const url = criterio
        ? `/api/criterios/${criterio.id}`
        : `/api/turmas/${turmaId}/criterios`;
      const method = criterio ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          peso: data.peso,
          descricao: data.descricao || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar critério');
      }

      return response.json();
    },
    onSuccess: (_, data) => {
      toast({
        title: criterio ? 'Critério atualizado!' : 'Critério criado!',
        description: `O critério "${data.nome}" foi ${criterio ? 'atualizado' : 'adicionado'} com sucesso.`,
      });
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar critério',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const config: GenericDialogConfig = {
    title: criterio ? 'Editar Critério' : 'Novo Critério',
    schema: criterioSchema,
    fields: [
      {
        name: 'nome',
        label: 'Nome do Critério',
        type: 'text',
        required: true,
        placeholder: 'Ex: Provas, Trabalhos, Participação',
      },
      {
        name: 'peso',
        label: `Peso (%) - Disponível: ${pesoDisponivel.toFixed(0)}%`,
        type: 'number',
        required: true,
        placeholder: 'Ex: 30',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        name: 'descricao',
        label: 'Descrição',
        type: 'textarea',
        required: false,
        placeholder: 'Descreva como este critério será avaliado...',
        rows: 3,
      },
    ],
    defaultValues: {
      nome: '',
      peso: 0,
      descricao: '',
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
      initialData={criterio ? {
        nome: criterio.nome,
        peso: criterio.peso,
        descricao: criterio.descricao || '',
      } : null}
      isEdit={!!criterio}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
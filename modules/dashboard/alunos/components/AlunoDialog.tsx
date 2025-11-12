'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GenericDialog, GenericDialogConfig } from '@/components/generic-dialog';
import { createAlunoSchema } from '@/modules/dashboard/alunos/schemas/aluno.schema';
import { useToast } from '@/hooks/use-toast';

interface Turma {
  id: string;
  nome: string;
  disciplina: string;
}

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email: string | null;
  foto_url: string | null;
  status: string;
  turmas?: { turma_id: string }[];
}

interface AlunoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aluno?: Aluno | null;
  turmas: Turma[];
  onSuccess: () => void;
}

export function AlunoDialog({
  open,
  onOpenChange,
  aluno,
  turmas,
  onSuccess,
}: AlunoDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadFunction = async (file: File, form: any) => {
    const formData = new FormData();
    formData.append('file', file);

    const tempId = aluno?.id || 'temp-' + Date.now();
    const response = await fetch(`/api/alunos/${tempId}/foto`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Erro ao fazer upload');

    const data = await response.json();
    return data.url as string;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = aluno ? `/api/alunos/${aluno.id}` : '/api/alunos';
      const method = aluno ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar aluno');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: aluno ? 'Aluno atualizado!' : 'Aluno criado!',
        description: `${aluno?.nome || 'Novo aluno'} foi ${aluno ? 'atualizado' : 'cadastrado'} com sucesso.`,
      });
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar aluno',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const config: GenericDialogConfig = {
    title: aluno ? 'Editar Aluno' : 'Novo Aluno',
    schema: createAlunoSchema,
    fields: [
      {
        name: 'foto_url',
        label: 'Foto',
        type: 'avatar',
      },
      {
        name: 'nome',
        label: 'Nome Completo',
        type: 'text',
        required: true,
        placeholder: 'Ex: João Silva Santos',
        gridSpan: 1,
      },
      {
        name: 'matricula',
        label: 'Matrícula',
        type: 'text',
        required: true,
        placeholder: 'Ex: 2024001',
        gridSpan: 1,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: false,
        placeholder: 'aluno@email.com',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'ativo', label: 'Ativo' },
          { value: 'inativo', label: 'Inativo' },
          { value: 'trancado', label: 'Trancado' },
        ],
      },
      {
        name: 'turmas',
        label: 'Turmas',
        type: 'badges',
        required: false,
        options: turmas.map(t => ({ value: t.id, label: t.nome })),
      },
    ],
    defaultValues: {
      nome: '',
      matricula: '',
      email: '',
      foto_url: '',
      status: 'ativo',
      turmas: [],
    },
    maxWidth: '600px',
    uploadFunction,
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
      initialData={aluno ? {
        foto_url: aluno.foto_url || '',
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email || '',
        status: aluno.status,
        turmas: aluno.turmas?.map((t) => t.turma_id) || [],
      } : null}
      isEdit={!!aluno}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
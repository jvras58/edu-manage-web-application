'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  createAlunoSchema,
  type CreateAlunoInput,
  type Aluno,
} from '@/modules/dashboard/alunos/schemas/aluno.schema';

type FormData = z.input<typeof createAlunoSchema>;

interface Turma {
  id: string;
  nome: string;
  disciplina: string;
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

  const form = useForm<FormData>({
    resolver: zodResolver(createAlunoSchema),
    defaultValues: {
      nome: '',
      matricula: '',
      email: '',
      foto_url: '',
      status: 'ativo',
      turmas: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const fotoUrl = watch('foto_url');

  useEffect(() => {
    if (aluno) {
      reset({
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email || '',
        foto_url: aluno.foto_url || '',
        status: aluno.status,
        turmas: aluno.turmas?.map((t) => t.turma_id) || [],
      });
    } else {
      reset({
        nome: '',
        matricula: '',
        email: '',
        foto_url: '',
        status: 'ativo',
        turmas: [],
      });
    }
  }, [aluno, open, reset]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
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
    },
    onSuccess: (url) => {
      setValue('foto_url', url);
      toast({
        title: 'Foto enviada com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao enviar foto',
        variant: 'destructive',
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: CreateAlunoInput) => {
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
        description: `${form.getValues('nome')} foi ${aluno ? 'atualizado' : 'cadastrado'} com sucesso.`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar aluno',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const toggleTurma = (turmaId: string) => {
    const currentTurmas = form.getValues('turmas') || [];
    const newTurmas = currentTurmas.includes(turmaId)
      ? currentTurmas.filter((id) => id !== turmaId)
      : [...currentTurmas, turmaId];
    setValue('turmas', newTurmas);
  };

  const onSubmit = (data: FormData) => {
    const submitData: CreateAlunoInput = {
      ...data,
      turmas: data.turmas || [],
    };
    saveMutation.mutate(submitData);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{aluno ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={fotoUrl || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                {form.getValues('nome')
                  ? getInitials(form.getValues('nome'))
                  : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="foto" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>
                    {uploadMutation.isPending ? 'Enviando...' : 'Enviar foto'}
                  </span>
                </div>
              </Label>
              <Controller
                name="foto_url"
                control={control}
                render={({ field }) => (
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileUpload(e);
                      field.onChange(e.target.files?.[0] ? 'uploading' : '');
                    }}
                    disabled={uploadMutation.isPending}
                    className="hidden"
                  />
                )}
              />
              {fotoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setValue('foto_url', '')}
                  className="mt-1 text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover foto
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva Santos"
                {...register('nome')}
                disabled={isSubmitting}
              />
              {errors.nome && (
                <p className="text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                placeholder="Ex: 2024001"
                {...register('matricula')}
                disabled={isSubmitting}
              />
              {errors.matricula && (
                <p className="text-sm text-red-600">
                  {errors.matricula.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="aluno@email.com"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="trancado">Trancado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Turmas</Label>
            <Controller
              name="turmas"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {turmas.map((turma) => (
                    <Badge
                      key={turma.id}
                      variant={
                        (field.value || []).includes(turma.id) ? 'default' : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTurma(turma.id)}
                    >
                      {turma.nome}
                    </Badge>
                  ))}
                </div>
              )}
            />
            {turmas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma turma disponível. Crie uma turma primeiro.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || uploadMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || uploadMutation.isPending}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : aluno ? (
                'Atualizar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

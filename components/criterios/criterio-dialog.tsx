'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { criterioSchema, FormData } from '@/modules/dashboard/criterios/schemas/criterio.schema';

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

  const form = useForm<FormData>({
    resolver: zodResolver(criterioSchema),
    defaultValues: {
      nome: '',
      peso: 0,
      descricao: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (criterio) {
      reset({
        nome: criterio.nome,
        peso: criterio.peso,
        descricao: criterio.descricao || '',
      });
    } else {
      reset({
        nome: '',
        peso: 0,
        descricao: '',
      });
    }
  }, [criterio, open, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!criterio && data.peso > pesoDisponivel) {
        throw new Error(
          `Peso excede o disponível. Máximo: ${pesoDisponivel.toFixed(0)}%`
        );
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
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar critério',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {criterio ? 'Editar Critério' : 'Novo Critério'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Critério *</Label>
            <Input
              id="nome"
              placeholder="Ex: Provas, Trabalhos, Participação"
              {...register('nome')}
              disabled={isSubmitting}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso">
              Peso (%) *{' '}
              {!criterio && `- Disponível: ${pesoDisponivel.toFixed(0)}%`}
            </Label>
            <Input
              id="peso"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="Ex: 30"
              {...register('peso', { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            {errors.peso && (
              <p className="text-sm text-red-600">{errors.peso.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva como este critério será avaliado..."
              {...register('descricao')}
              disabled={isSubmitting}
              rows={3}
            />
            {errors.descricao && (
              <p className="text-sm text-red-600">{errors.descricao.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : criterio ? (
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

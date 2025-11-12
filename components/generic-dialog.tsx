'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'textarea'
  | 'select'
  | 'file'
  | 'avatar'
  | 'badges';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  gridSpan?: number;
  customLabel?: string;
  disabled?: boolean;
}

export interface GenericDialogConfig<T = any> {
  title: string;
  schema: any;
  fields: FieldConfig[];
  defaultValues: Record<string, any>;
  maxWidth?: string;
  uploadFunction?: (file: File, form: any) => Promise<string>;
  customComponents?: {
    [key: string]: (props: {
      form: any;
      field: any;
      config: FieldConfig;
      isSubmitting: boolean;
      errors: any;
    }) => React.ReactElement;
  };
}

interface GenericDialogProps<T = any> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GenericDialogConfig<T>;
  initialData?: T | null;
  isEdit?: boolean;
  onSubmit: (data: T) => void;
  isSubmitting?: boolean;
}

export function GenericDialog<T = any>({
  open,
  onOpenChange,
  config,
  initialData,
  isEdit = false,
  onSubmit,
  isSubmitting = false,
}: GenericDialogProps<T>) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(config.defaultValues);
    }
  }, [initialData, open, reset, config.defaultValues]);

  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && config.uploadFunction) {
      setUploadLoading(true);
      try {
        const url = await config.uploadFunction(file, form);
        setValue('foto_url', url);
        toast({
          title: 'Foto enviada com sucesso!',
        });
      } catch (error) {
        toast({
          title: 'Erro ao enviar foto',
          variant: 'destructive',
        });
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const toggleBadge = (fieldName: string, value: string) => {
    const currentValues = form.getValues(fieldName) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setValue(fieldName, newValues);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderField = (fieldConfig: FieldConfig) => {
    const { name, label, type, required, placeholder, options, min, max, step, rows, accept, customLabel } = fieldConfig;
    const fieldLabel = customLabel || label;
    const isRequired = required ? ' *' : '';

    // Campo customizado
    if (config.customComponents?.[name]) {
      return (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => config.customComponents![name]({
            form,
            field,
            config: fieldConfig,
            isSubmitting: isSubmitting || uploadLoading,
            errors,
          })}
        />
      );
    }

    switch (type) {
      case 'avatar':
        const fotoUrl = watch('foto_url');
        return (
          <div key={name} className="flex items-center gap-4">
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
                  {uploadLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>
                    {uploadLoading ? 'Enviando...' : 'Enviar foto'}
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
                    accept={accept || "image/*"}
                    onChange={(e) => {
                      handleFileUpload(e);
                      field.onChange(e.target.files?.[0] ? 'uploading' : '');
                    }}
                    disabled={uploadLoading}
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
        );

      case 'badges':
        return (
          <div key={name} className="space-y-2">
            <Label>{fieldLabel}{isRequired}</Label>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {options?.map((option) => (
                    <Badge
                      key={option.value}
                      variant={
                        (field.value || []).includes(option.value) ? 'default' : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleBadge(name, option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              )}
            />
            {options?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma opção disponível.
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{fieldLabel}{isRequired}</Label>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors[name] && (
              <p className="text-sm text-red-600">{String(errors[name]?.message)}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{fieldLabel}{isRequired}</Label>
            <Textarea
              id={name}
              placeholder={placeholder}
              {...register(name)}
              disabled={isSubmitting}
              rows={rows || 3}
            />
            {errors[name] && (
              <p className="text-sm text-red-600">{String(errors[name]?.message)}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{fieldLabel}{isRequired}</Label>
            <Input
              id={name}
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              {...register(name, { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            {errors[name] && (
              <p className="text-sm text-red-600">{String(errors[name]?.message)}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{fieldLabel}{isRequired}</Label>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              {...register(name)}
              disabled={isSubmitting}
            />
            {errors[name] && (
              <p className="text-sm text-red-600">{String(errors[name]?.message)}</p>
            )}
          </div>
        );
    }
  };

  const handleSubmitForm = (data: any) => {
    onSubmit(data);
  };

  // Organizar campos em grid
  const gridFields = config.fields.filter(f => f.gridSpan);
  const normalFields = config.fields.filter(f => !f.gridSpan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[${config.maxWidth || '500px'}] max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Campos com grid */}
          {gridFields.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {gridFields.map(renderField)}
            </div>
          )}

          {/* Campos normais */}
          {normalFields.map(renderField)}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || uploadLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || uploadLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEdit ? (
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
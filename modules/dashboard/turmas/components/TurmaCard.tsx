'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Turma } from '@/modules/dashboard/turmas/types/turmas.types';

interface TurmaCardProps {
  turma: Turma;
  onEdit: (turma: Turma) => void;
  onDelete: (turma: Turma) => void;
}

export function TurmaCard({ turma, onEdit, onDelete }: TurmaCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900">{turma.nome}</h3>
          <Badge variant="info">{turma.ano_letivo}</Badge>
        </div>
        <p className="text-gray-600">{turma.disciplina}</p>
      </div>

      <div className="flex gap-4 pt-2 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{turma.total_alunos} alunos</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClipboardList className="h-4 w-4" />
          <span>{turma.total_criterios} critérios</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          asChild
        >
          <Link href={`/turmas/${turma.id}`}>Ver Detalhes</Link>
        </Button>
        <Button variant="outline" size="icon" onClick={() => onEdit(turma)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(turma)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </Card>
  );
}

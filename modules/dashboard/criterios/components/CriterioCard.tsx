'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2 } from 'lucide-react';

import { Criterio } from '@/modules/dashboard/criterios/types/criterios.types';

interface CriterioCardProps {
  criterio: Criterio;
  onEdit: (criterio: Criterio) => void;
  onDelete: (criterio: Criterio) => void;
}

export function CriterioCard({
  criterio,
  onEdit,
  onDelete,
}: CriterioCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">{criterio.nome}</h3>
            <Badge>
              {Number.parseFloat(criterio.peso.toString()).toFixed(0)}%
            </Badge>
          </div>
          {criterio.descricao && (
            <p className="text-sm text-gray-600">{criterio.descricao}</p>
          )}
          <Progress
            value={Number.parseFloat(criterio.peso.toString())}
            className="h-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(criterio)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(criterio)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

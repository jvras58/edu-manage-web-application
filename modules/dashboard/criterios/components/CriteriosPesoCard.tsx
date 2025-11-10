'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { useCriteriosTurma } from '@/modules/dashboard/criterios/providers/CriteriosTurmaProvider';

export function CriteriosPesoCard() {
  const { somaPesos, pesoDisponivel } = useCriteriosTurma();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Distribuição de Pesos
        </h2>
        <Badge
          variant={
            somaPesos === 100
              ? 'success'
              : somaPesos > 100
                ? 'destructive'
                : 'warning'
          }
        >
          {somaPesos.toFixed(0)}% de 100%
        </Badge>
      </div>

      <Progress value={somaPesos} className="h-3" />

      {somaPesos < 100 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ainda faltam {pesoDisponivel.toFixed(0)}% para completar 100%.
            Adicione mais critérios ou ajuste os pesos existentes.
          </AlertDescription>
        </Alert>
      )}

      {somaPesos === 100 && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfeito! A soma dos pesos está em 100%.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

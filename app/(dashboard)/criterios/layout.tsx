import { CriteriosProvider } from '@/modules/dashboard/criterios/providers/CriteriosProvider';
import type React from 'react';

export default function CriteriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 lg:p-6">
        <CriteriosProvider>{children}</CriteriosProvider>
      </main>
    </div>
  );
}

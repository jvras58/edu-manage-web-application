import { AlunosProvider } from '@/modules/dashboard/alunos/providers/AlunosProvider';
import type React from 'react';

export default function AlunosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 lg:p-6">
        <AlunosProvider>{children}</AlunosProvider>
      </main>
    </div>
  );
}

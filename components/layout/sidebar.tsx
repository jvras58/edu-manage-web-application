'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Turmas',
    href: '/turmas',
    icon: BookOpen,
  },
  {
    label: 'Alunos',
    href: '/alunos',
    icon: Users,
  },
  {
    label: 'Critérios',
    href: '/criterios',
    icon: ClipboardList,
  },
  {
    label: 'Notificações',
    href: '/notificacoes',
    icon: Bell,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
              onClick={onClose}
            >
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EduManage</h1>
                <p className="text-xs text-muted-foreground">Portal do Professor</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-1">
            <Link
              href="#"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-4 py-3 text-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

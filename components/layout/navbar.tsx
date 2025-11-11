'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onMenuClick: () => void;
}

interface Notificacao {
  id: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  mensagem: string;
  lida: boolean;
  created_at: string;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [user, setUser] = useState<{ nome: string; email: string } | null>(
    null
  );
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('  Failed to fetch user:', error);
      }
    };

    fetchUser();
    fetchNotificacoes();

    const interval = setInterval(fetchNotificacoes, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificacoes = async () => {
    try {
      const response = await fetch('/api/notificacoes?limit=5');
      if (response.ok) {
        const data = await response.json();
        setNotificacoes(data.notificacoes);
      }
    } catch (error) {
      console.error('  Failed to fetch notifications:', error);
    }
  };

  const marcarComoLida = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
        );
      }
    } catch (error) {
      console.error('  Failed to mark as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletarNotificacao = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotificacoes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('  Failed to delete notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex-1 lg:block hidden">
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {naoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs font-medium">
                    {naoLidas > 9 ? '9+' : naoLidas}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold text-sm">Notificações</h3>
                {naoLidas > 0 && (
                  <Badge variant="info" className="h-5 px-2 text-xs">
                    {naoLidas} nova{naoLidas > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>

              {notificacoes.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  {notificacoes.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={cn(
                        'px-4 py-3 border-b hover:bg-muted transition-colors',
                        !notificacao.lida && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2">
                            {notificacao.mensagem}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notificacao.created_at).toLocaleString(
                              'pt-BR',
                              {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notificacao.lida && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => marcarComoLida(notificacao.id, e)}
                              disabled={loading}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) =>
                              deletarNotificacao(notificacao.id, e)
                            }
                            disabled={loading}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  href="/notificacoes"
                  className="w-full text-center py-2 text-sm font-medium text-primary"
                >
                  Ver todas as notificações
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(user.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">
                  {user.nome}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

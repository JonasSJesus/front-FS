import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Building2,
  HelpCircle,
  ClipboardList,
  LogOut,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: ('admin' | 'gestor' | 'usuario')[];
}

const navItems: NavItem[] = [
  // Admin
  { label: 'Empresas', icon: Building2, path: '/admin/empresas', roles: ['admin'] },
  { label: 'Usuários', icon: Users, path: '/admin/usuarios', roles: ['admin'] },
  { label: 'Banco de Perguntas', icon: HelpCircle, path: '/admin/perguntas', roles: ['admin'] },
  { label: 'Questionários', icon: ClipboardList, path: '/admin/questionarios', roles: ['admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item =>
    hasRole(item.roles)
  );

  const roleLabel = {
    admin: 'Administrador',
    gestor: 'Gestor',
    usuario: 'Colaborador',
  };

  return (
    <>
      {/* Overlay para mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar transition-all duration-300',
          // Desktop
          'hidden lg:flex',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile
          mobileOpen && 'flex',
          mobileOpen ? 'w-64' : 'w-0'
        )}
      >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-semibold text-sidebar-foreground">Sistema</h1>
              <p className="text-xs text-sidebar-foreground/60">Saúde Mental</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'hidden lg:flex h-8 w-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            collapsed && 'absolute -right-4 top-6 rounded-full bg-sidebar border border-sidebar-border'
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="border-b border-sidebar-border p-4 animate-fade-in">
          <p className="font-medium text-sidebar-foreground">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/60">{roleLabel[user.role]}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-1 py-1 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                        collapsed && 'justify-center'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                'w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sair</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              Sair
            </TooltipContent>
          )}
        </Tooltip>
      </div>
      </aside>
    </>
  );
};

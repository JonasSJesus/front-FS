import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      
      {/* Header Mobile */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="ml-3 text-lg font-semibold">Sistema</h1>
      </header>

      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          // Mobile: adiciona padding-top para o header
          'pt-16 lg:pt-0',
          // Desktop: adiciona margin-left para o sidebar
          'lg:ml-20',
          !sidebarCollapsed && 'lg:ml-64'
        )}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

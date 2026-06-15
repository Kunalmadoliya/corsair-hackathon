'use client';

import {
  LayoutDashboard, Inbox, Calendar, GitBranch, BarChart3, Settings,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { Logo } from './logo';

export type PageId = 'dashboard' | 'inbox' | 'calendar' | 'workflows' | 'analytics' | 'settings';

const navItems: { icon: React.ElementType; label: string; id: PageId; badge?: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Inbox, label: 'Inbox', id: 'inbox', badge: '47' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: GitBranch, label: 'Workflows', id: 'workflows' },
  { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn('h-full flex flex-col border-r border-border/40 bg-card/30 transition-all duration-200 flex-shrink-0', collapsed ? 'w-12' : 'w-44')}>
      <div className="h-11 flex items-center justify-between px-3 border-b border-border/30">
        {!collapsed && <Logo size="sm" showText={true} />}
        <button onClick={() => setCollapsed(!collapsed)} className="w-5 h-5 rounded hover:bg-secondary flex items-center justify-center">
          {collapsed ? <ChevronRight className="w-3 h-3 text-muted-foreground" /> : <ChevronLeft className="w-3 h-3 text-muted-foreground" />}
        </button>
      </div>
      <div className="flex-1 py-2 px-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={cn('w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <><span className="flex-1 text-left">{item.label}</span>{item.badge && <span className="text-[8px] font-medium px-1 py-0.5 rounded-full bg-primary/10 text-primary">{item.badge}</span>}</>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

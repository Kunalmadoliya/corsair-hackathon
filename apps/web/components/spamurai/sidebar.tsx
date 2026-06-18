'use client';

import {
  LayoutDashboard, Inbox, Calendar, Settings,
  ChevronLeft, ChevronRight, MessageSquare, Plus, LogOut, Globe, Sun, Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import { Logo } from './logo';
import { useListMessages } from '~/hooks/api/corsair/gmail';
import { usegetUser } from '~/hooks/api/auth/auth';
import { trpc } from '~/trpc/client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export type PageId = 'dashboard' | 'inbox' | 'calendar' | 'settings' | 'integrations';

const navItemsBase: { icon: React.ElementType; label: string; id: PageId; badge?: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Inbox, label: 'Inbox', id: 'inbox' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Globe, label: 'Integrations', id: 'integrations' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  chatId?: string;
  onChatSelect?: (id: string) => void;
  onNewChat?: () => void;
}

export function Sidebar({ activePage, onNavigate, chatId, onChatSelect, onNewChat }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = usegetUser();
  const { listMessagesAsync } = useListMessages();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { mutateAsync: logoutUser } = trpc.auth.logoutUser.useMutation();

  const handleLogout = async () => {
    try {
      await logoutUser({});
      router.push('/auth/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const { data: chatHistory } = trpc.chat.listChats.useQuery({}, {
    enabled: !!user?.isGmailConnected
  });

  useEffect(() => {
    if (user?.isGmailConnected) {
      listMessagesAsync({ q: 'is:unread', maxResults: 1 }).then((res: any) => {
        if (res?.messages?.resultSizeEstimate) setUnreadCount(res.messages.resultSizeEstimate);
      }).catch(console.error);
    }
  }, [user?.isGmailConnected]);

  const navItems = navItemsBase.map(item => {
    if (item.id === 'inbox' && unreadCount !== null) {
      return { ...item, badge: unreadCount.toString() };
    }
    return item;
  });

  return (
    <aside className={cn('h-full flex flex-col border-r border-border/40 bg-card/30 transition-all duration-200 flex-shrink-0', collapsed ? 'w-12' : 'w-44')}>
      <div className="h-11 flex items-center justify-between px-3 border-b border-border/30">
        {!collapsed && <Logo size="sm" showText={true} />}
        <button onClick={() => setCollapsed(!collapsed)} className="w-5 h-5 rounded hover:bg-secondary flex items-center justify-center">
          {collapsed ? <ChevronRight className="w-3 h-3 text-muted-foreground" /> : <ChevronLeft className="w-3 h-3 text-muted-foreground" />}
        </button>
      </div>
      <div className="flex-1 py-2 px-1 space-y-0.5 overflow-y-auto custom-scroll">
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

        {!collapsed && user?.isGmailConnected && (
          <div className="pt-4 pb-2">
            <div className="px-2 flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Chats</span>
              {onNewChat && (
                <button onClick={onNewChat} className="text-muted-foreground hover:text-foreground">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {chatHistory?.chats?.map((chat: any) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect?.(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors truncate",
                    chatId === chat.id && activePage === 'dashboard' ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{chat.title || "New Chat"}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Corner */}
      {!collapsed && user && (
        <div className="p-3 border-t border-border/30 mt-auto flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Toggle Theme">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={handleLogout} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors" title="Log Out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-secondary/30 border border-border/20">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
              {user.fullname ? user.fullname.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-foreground">{user.fullname || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

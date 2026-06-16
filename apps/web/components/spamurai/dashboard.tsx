'use client';

import { useState } from 'react';
import { Sidebar, PageId } from './sidebar';
import { ChatInterface } from './chat-interface';
import { CommandBar } from './command-bar';
import { InboxPage } from './pages/inbox-page';
import { CalendarPage } from './pages/calendar-page';
import { WorkflowsPage } from './pages/workflows-page';
import { AnalyticsPage } from './pages/analytics-page';
import { SettingsPage } from './pages/settings-page';
import { IntegrationsPage } from './pages/integrations-page';
import { Logo } from './logo';
import { Command, Bell, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Toaster } from '~/components/ui/toaster';
import { usegetUser } from '~/hooks/api/auth/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardProps { onBack?: () => void; }

function GmailNotConnectedBanner({ onGoToIntegrations }: { onGoToIntegrations: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#EA4335]/10 border border-[#EA4335]/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-[#EA4335]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">Connect Gmail to get started</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Corsair needs access to your Gmail account before it can read, summarise, and act on your emails. Connect Gmail to unlock AI productivity features.
          </p>
        </div>
        <Button
          onClick={onGoToIntegrations}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Go to Integrations
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export function Dashboard({ onBack }: DashboardProps) {

  const { user, isLoading } = usegetUser();
  const router = useRouter();
    const [activePage, setActivePage] = useState('dashboard');
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;
  


  const handleCommand = (command: string) => {
    const key = command.replace('/', '') as PageId;
    const valid: PageId[] = ['dashboard', 'inbox', 'calendar', 'workflows', 'analytics', 'settings', 'integrations'];
    if (valid.includes(key)) setActivePage(key);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toaster />
      <header className="h-12 flex items-center justify-between px-4 border-b border-border/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-7 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />Back
            </Button>
          )}
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setCommandBarOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/30 text-sm text-muted-foreground hover:border-border/50 transition-colors">
            <Command className="w-3 h-3" />Command <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background text-muted-foreground ml-1">⌘K</kbd>
          </button>
          <button onClick={() => setActivePage('inbox')} className="relative w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">47</div>
          </button>
          <button className="w-8 h-8 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center text-[10px] font-semibold text-primary">KT</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {activePage !== 'dashboard' && (
            <div className="h-10 flex items-center px-5 border-b border-border/20 flex-shrink-0">
              <span className="text-sm font-semibold capitalize">{activePage}</span>
            </div>
          )}
          {activePage === 'dashboard' && (
            user.isGmailConnected
              ? <ChatInterface />
              : <GmailNotConnectedBanner onGoToIntegrations={() => setActivePage('integrations')} />
          )}
          {activePage === 'inbox' && <InboxPage />}
          {activePage === 'calendar' && <CalendarPage />}
          {activePage === 'workflows' && <WorkflowsPage />}
          {activePage === 'analytics' && <AnalyticsPage />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'integrations' && <IntegrationsPage />}
        </div>
      </div>

      <CommandBar isOpen={commandBarOpen} onClose={() => setCommandBarOpen(false)} onCommand={handleCommand} />
    </div>
  );
}

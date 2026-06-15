'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Mail, Calendar, GitBranch, Users, Inbox, Settings, BarChart3, ArrowRight, Command, LayoutDashboard } from 'lucide-react';

const commands = [
  { icon: LayoutDashboard, label: '/dashboard', description: 'AI chat interface' },
  { icon: Mail, label: '/inbox', description: 'View and manage emails' },
  { icon: Calendar, label: '/calendar', description: 'Schedule and view events' },
  { icon: GitBranch, label: '/workflows', description: 'Manage automations' },
  { icon: BarChart3, label: '/analytics', description: 'View analytics' },
  { icon: Settings, label: '/settings', description: 'Configure preferences' },
  { icon: Search, label: '/search', description: 'Search across all data' },
  { icon: Users, label: '/contact', description: 'Find or manage contacts' },
];

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function CommandBar({ isOpen, onClose, onCommand }: CommandBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) { inputRef.current?.focus(); setQuery(''); }
  }, [isOpen]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (isOpen) onClose(); }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[16vh]">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-lg overflow-hidden shadow-xl animate-fade-in">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
          <Command className="w-3.5 h-3.5 text-primary" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Type a command..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none" />
          <kbd className="text-[8px] px-1 py-0.5 rounded bg-secondary text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-48 overflow-y-auto custom-scroll p-1">
          {filtered.map(cmd => {
            const Icon = cmd.icon;
            return (
              <button key={cmd.label} onClick={() => { onCommand(cmd.label); onClose(); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-secondary/60 transition-colors group">
                <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1 text-left"><div className="text-[10px] font-medium">{cmd.label}</div><div className="text-[9px] text-muted-foreground">{cmd.description}</div></div>
                <ArrowRight className="w-2.5 h-2.5 text-muted-foreground/15 group-hover:text-primary transition-colors" />
              </button>
            );
          })}
          {filtered.length === 0 && <div className="py-4 text-center text-[10px] text-muted-foreground">No commands found</div>}
        </div>
      </div>
    </div>
  );
}

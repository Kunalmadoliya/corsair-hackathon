'use client';

import { Mail, Calendar, Users, Inbox, Zap, Layers, BarChart3, GitBranch, ArrowRight } from 'lucide-react';

const items = [
  { title: 'AI Email Management', description: 'Intelligent drafting, prioritization, and response generation powered by advanced AI.', icon: Mail, span: 'md:col-span-2',
    mock: (<div className="mt-4 space-y-2">{[{ from: 'rahul@acmecorp.com', time: '2m' }, { from: 'sarah@design.co', time: '15m' }, { from: 'marcus@eng.io', time: '1h' }].map(e => (
      <div key={e.from} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 text-sm"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-foreground/60 flex-1">{e.from}</span><span className="text-muted-foreground/60 text-xs">{e.time}</span></div>
    ))}</div>),
  },
  { title: 'Calendar Automation', description: 'Smart scheduling that finds the perfect time for everyone.', icon: Calendar, span: '',
    mock: (<div className="mt-4 space-y-1.5">{[{ time: '2:00 PM', label: 'Product Review' }, { time: '3:30 PM', label: 'Client Demo' }, { time: '5:00 PM', label: '1:1' }].map(e => (
      <div key={e.time} className="p-2 rounded-lg bg-secondary/40 text-xs text-foreground/50"><span className="text-primary font-semibold">{e.time}</span> — {e.label}</div>
    ))}</div>),
  },
  { title: 'Meeting Scheduling', description: 'AI handles timezones and invitations automatically.', icon: Users, span: '',
    mock: (<div className="mt-4 flex items-center gap-1.5">{['RS','SC','MJ','LP','+3'].map(a => (
      <div key={a} className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-[10px] font-medium text-foreground/50 border border-border/40">{a}</div>
    ))}</div>),
  },
  { title: 'Inbox Summaries', description: 'Instant digests of your inbox. Never miss what matters.', icon: Inbox, span: 'md:col-span-2',
    mock: (<div className="mt-4 grid grid-cols-3 gap-2">{[{ value: '47', label: 'Unread' }, { value: '12', label: 'Urgent' }, { value: '8', label: 'Reply' }].map(s => (
      <div key={s.label} className="p-3 rounded-lg bg-secondary/40 text-center"><div className="text-2xl font-bold text-foreground/90">{s.value}</div><div className="text-xs text-muted-foreground mt-0.5">{s.label}</div></div>
    ))}</div>),
  },
  { title: 'Workflow Automation', description: 'Create powerful automations with natural language commands.', icon: Zap, span: 'md:col-span-2',
    mock: (<div className="mt-4 flex items-center gap-3 text-sm"><span className="px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">Trigger</span><ArrowRight className="w-4 h-4 text-muted-foreground" /><span className="px-3 py-1 rounded-md bg-foreground/5 text-foreground/60 border border-border/40">Action</span><ArrowRight className="w-4 h-4 text-muted-foreground" /><span className="px-3 py-1 rounded-md bg-foreground/5 text-foreground/60 border border-border/40">Result</span></div>),
  },
  { title: 'Multi Inbox', description: 'All accounts in one interface. Zero chaos.', icon: Layers, span: '',
    mock: (<div className="mt-4 space-y-1.5">{[{ name: 'Work', n: 23 }, { name: 'Personal', n: 8 }, { name: 'Newsletter', n: 16 }].map(e => (
      <div key={e.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40 text-sm"><span className="text-foreground/60">{e.name}</span><span className="text-primary font-medium">{e.n}</span></div>
    ))}</div>),
  },
  { title: 'Analytics', description: 'Track communication patterns and productivity.', icon: BarChart3, span: '',
    mock: (<div className="mt-4 flex items-end gap-1.5 h-16">{[40,65,35,80,55,30,25].map(h => (
      <div key={h} className="flex-1 rounded-sm bg-primary/25 hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
    ))}</div>),
  },
  { title: 'Integrations', description: 'Connect Slack, Notion, Jira, and 50+ tools.', icon: GitBranch, span: '',
    mock: (<div className="mt-4 flex flex-wrap gap-1.5">{['Slack','Notion','Jira','GCal','Zoom'].map(t => (
      <span key={t} className="px-2.5 py-1 rounded-md bg-secondary/40 text-xs text-foreground/50 border border-border/30">{t}</span>
    ))}</div>),
  },
];

export function BentoGrid() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need, <span className="text-gradient">one conversation away</span></h2>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">Replace dozens of tools with a single AI-powered interface.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`${item.span} rounded-xl border border-border/40 bg-card p-5 hover:border-primary/25 card-hover`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                {item.mock}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

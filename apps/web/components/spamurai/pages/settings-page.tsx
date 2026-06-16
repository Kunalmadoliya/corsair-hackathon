'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, Key, Check } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'api', label: 'API Keys', icon: Key },
];

export function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('Kenji Tanaka');
  const [email, setEmail] = useState('kenji@spamurai.io');
  const [notifications, setNotifications] = useState({ email: true, slack: true, desktop: false });
  const [isLightTheme, setIsLightTheme] = useState(false);

  // Apply theme class to html element, but initialize from current DOM state
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsLightTheme(document.documentElement.classList.contains('light'));
    }
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = !isLightTheme;
    setIsLightTheme(nextTheme);
    const html = document.documentElement;
    if (nextTheme) {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    toast({ description: `Switched to ${nextTheme ? 'light' : 'dark'} theme` });
  };

  const handleSave = () => { toast({ description: 'Settings saved' }); };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
        </div>

        <div className="flex gap-6">
          <div className="w-40 flex-shrink-0 space-y-0.5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                    activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="text-base font-semibold">Profile Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-lg font-bold text-primary">KT</div>
                  <Button variant="outline" size="sm" className="text-sm" onClick={() => toast({ description: 'Avatar upload coming soon' })}>Change Avatar</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground block mb-1">Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                  <div><label className="text-xs text-muted-foreground block mb-1">Email</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                </div>
                <div><label className="text-xs text-muted-foreground block mb-1">Role</label><input defaultValue="Product Manager" className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/30 transition-colors" /></div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={handleSave}>Save Changes</Button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="text-base font-semibold">Notification Preferences</h3>
                {[
                  { key: 'email' as const, label: 'Email notifications', desc: 'Receive updates via email' },
                  { key: 'slack' as const, label: 'Slack notifications', desc: 'Receive updates in Slack' },
                  { key: 'desktop' as const, label: 'Desktop notifications', desc: 'Browser push notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <div><div className="text-sm text-foreground/80">{item.label}</div><div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div></div>
                    <button onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className={cn('w-10 h-5 rounded-full transition-all relative', notifications[item.key] ? 'bg-primary' : 'bg-secondary border border-border')}>
                      <div className={cn('w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm', notifications[item.key] ? 'left-5' : 'left-0.5')} />
                    </button>
                  </div>
                ))}
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={handleSave}>Save Preferences</Button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="text-base font-semibold">Security</h3>
                <div><label className="text-xs text-muted-foreground block mb-1">Current Password</label><input type="password" className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30 transition-colors" /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">New Password</label><input type="password" className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30 transition-colors" /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">Confirm Password</label><input type="password" className="w-full bg-secondary/40 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/30 transition-colors" /></div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-hover" onClick={() => toast({ description: 'Password updated' })}>Update Password</Button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="text-base font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred theme.</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => { if (isLightTheme) handleThemeToggle(); }}
                    className={cn('w-28 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all',
                      !isLightTheme ? 'border-primary bg-background' : 'border-border bg-background hover:border-primary/30')}>
                    <div className="w-6 h-6 rounded-full bg-foreground/80" />
                    <span className="text-xs font-medium">Dark</span>
                    {!isLightTheme && <Check className="w-3 h-3 text-primary" />}
                  </button>
                  <button onClick={() => { if (!isLightTheme) handleThemeToggle(); }}
                    className={cn('w-28 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all',
                      isLightTheme ? 'border-primary bg-white' : 'border-border bg-white hover:border-primary/30')}>
                    <div className="w-6 h-6 rounded-full bg-gray-800" />
                    <span className="text-xs font-medium text-gray-800">Light</span>
                    {isLightTheme && <Check className="w-3 h-3 text-primary" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
                <h3 className="text-base font-semibold">Connected Services</h3>
                {['Gmail', 'Slack', 'Google Calendar', 'Zoom', 'Notion', 'Jira'].map(name => {
                  const connected = name === 'Gmail' || name === 'Slack' || name === 'Google Calendar';
                  return (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-border/15">
                      <span className="text-sm text-foreground/75">{name}</span>
                      <Button variant={connected ? 'ghost' : 'outline'} size="sm" className={cn('text-xs', connected && 'text-primary')} onClick={() => toast({ description: connected ? `Disconnect ${name}?` : `Connecting ${name}...` })}>
                        {connected ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'api' && (
              <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="text-base font-semibold">API Keys</h3>
                <div className="p-3 rounded-lg bg-secondary/40 border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">Production Key</div>
                  <div className="text-sm font-mono text-foreground/60">sk-xxxx-xxxx-xxxx-xxxx</div>
                </div>
                <Button variant="outline" size="sm" className="text-sm" onClick={() => toast({ description: 'New key generated' })}>Generate New Key</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

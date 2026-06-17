'use client';

import { Mail, Calendar as CalendarIcon, CheckCircle2, Link2, Layers } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';
import { usegetUser } from '~/hooks/api/auth/auth';
import { useConnectGmail } from '~/hooks/api/corsair/gmail';
import { useConnectCalendar } from '~/hooks/api/corsair/calendar';
import { trpc } from '~/trpc/client';

export function IntegrationsPage() {
  const { toast } = useToast();
  const { user, isLoading } = usegetUser();
  const { connectGmailAsync, isPending } = useConnectGmail();
  const { connectCalendarAsync, isPending: isCalendarPending } = useConnectCalendar();
  const { mutateAsync: syncHistory, isPending: isSyncing } = trpc.sync.syncHistoricalData.useMutation();

  const isGmailConnected = user?.isGmailConnected ?? false;
  const isCalendarConnected = user?.isCalendarConnected ?? false;

  const handleConnectGmail = async () => {
    try {
      if (!user?.id) {
        toast({ variant: 'destructive', description: 'You must be logged in to connect Gmail.' });
        return;
      }
      const data = await connectGmailAsync({ id: user.id });
      if (data.url) window.location.href = data.url;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to connect Gmail', description: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    }
  };

  const handleConnectCalendar = async () => {
    try {
      if (!user?.id) {
        toast({ variant: 'destructive', description: 'You must be logged in to connect Calendar.' });
        return;
      }
      const data = await connectCalendarAsync({});
      if (data.url) window.location.href = data.url;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to connect Calendar', description: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    }
  };

  const handleSyncHistory = async () => {
    try {
      const result = await syncHistory();
      toast({ description: `Successfully synced ${result.emailsSynced} emails and ${result.eventsSynced} events.` });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to sync historical data',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground mt-1">
            Connect your accounts to let Corsair automate your workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gmail Card */}
          <div className={`rounded-xl border bg-card/30 p-6 flex flex-col transition-all ${
            isGmailConnected ? 'border-[#EA4335]/30 ring-1 ring-[#EA4335]/20 bg-[#EA4335]/5' : 'border-border/40 hover:bg-secondary/10'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EA4335]/10 flex items-center justify-center border border-[#EA4335]/20 flex-shrink-0">
                <Mail className="w-6 h-6 text-[#EA4335]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold">Gmail</h3>
                  {isGmailConnected && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#EA4335]/10 text-[#EA4335] border border-[#EA4335]/20">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Read, summarise, and act on emails autonomously.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-4">
              {isGmailConnected ? (
                <Button variant="outline" disabled className="w-full bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/30 pointer-events-none">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Gmail Connected
                </Button>
              ) : (
                <Button onClick={handleConnectGmail} disabled={isPending || isLoading} className="w-full bg-[#EA4335] text-white hover:bg-[#EA4335]/90">
                  {isPending ? 'Connecting…' : <><Link2 className="w-4 h-4 mr-2" />Connect Gmail</>}
                </Button>
              )}
            </div>
          </div>

          {/* Calendar Card */}
          <div className={`rounded-xl border bg-card/30 p-6 flex flex-col transition-all ${
            isCalendarConnected ? 'border-[#4285F4]/30 ring-1 ring-[#4285F4]/20 bg-[#4285F4]/5' : 'border-border/40 hover:bg-secondary/10'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 flex items-center justify-center border border-[#4285F4]/20 flex-shrink-0">
                <CalendarIcon className="w-6 h-6 text-[#4285F4]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold">Google Calendar</h3>
                  {isCalendarConnected && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule meetings and find availability automatically.
                </p>
              </div>
            </div>
            <div className="mt-auto pt-4">
              {isCalendarConnected ? (
                <Button variant="outline" disabled className="w-full bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30 pointer-events-none">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Calendar Connected
                </Button>
              ) : (
                <Button onClick={handleConnectCalendar} disabled={isCalendarPending || isLoading} className="w-full bg-[#4285F4] text-white hover:bg-[#4285F4]/90">
                  {isCalendarPending ? 'Connecting…' : <><Link2 className="w-4 h-4 mr-2" />Connect Calendar</>}
                </Button>
              )}
            </div>
          </div>

          {/* Sync Button (if both connected) */}
          {(isGmailConnected || isCalendarConnected) && (
            <div className="md:col-span-2 pt-4 flex justify-end">
              <Button onClick={handleSyncHistory} disabled={isSyncing} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {isSyncing ? "Syncing..." : "Sync Historical Data"}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

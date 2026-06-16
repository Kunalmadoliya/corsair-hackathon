'use client';

import { Mail, Calendar as CalendarIcon, CheckCircle2, Link2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';
import { usegetUser } from '~/hooks/api/auth/auth';
import { useConnectGmail } from '~/hooks/api/corsair/gmail';

export function IntegrationsPage() {
  const { toast } = useToast();
  const { user, isLoading } = usegetUser();
  const { connectGmailAsync, isPending } = useConnectGmail();

  const isGmailConnected = user?.isGmailConnected ?? false;
  const isCalendarConnected = user?.isCalendarConnected ?? false;

  const handleConnectGmail = async () => {
    try {
      if (!user?.id) {
        toast({
          variant: 'destructive',
          description: 'You must be logged in to connect Gmail.',
        });
        return;
      }

      const data = await connectGmailAsync({ id: user.id });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to connect Gmail',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const handleConnectCalendar = () => {
    toast({
      title: 'Coming Soon',
      description: 'Calendar integration is currently under development.',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground mt-1">
            Connect your favorite tools to let Corsair automate your workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gmail Card */}
          <div className={`rounded-xl border bg-card/30 p-6 flex flex-col transition-all ${
            isGmailConnected
              ? 'border-primary/30 ring-1 ring-primary/20 bg-primary/5'
              : 'border-border/40 hover:bg-secondary/10'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#EA4335]/10 flex items-center justify-center mb-4 border border-[#EA4335]/20">
              <Mail className="w-6 h-6 text-[#EA4335]" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Google Mail</h3>
              {isGmailConnected && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground flex-1 mb-6">
              Connect your Gmail account to let Corsair draft responses, summarize long threads, and automatically sort your inbox.
            </p>

            <div className="flex items-center gap-3 mt-auto">
              {isGmailConnected ? (
                <Button
                  variant="outline"
                  disabled
                  className="w-full sm:w-auto bg-primary/10 text-primary border-primary/30 pointer-events-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Connected
                </Button>
              ) : (
                <Button
                  onClick={handleConnectGmail}
                  disabled={isPending || isLoading}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPending ? 'Connecting...' : <><Link2 className="w-4 h-4 mr-2" /> Connect Gmail</>}
                </Button>
              )}
            </div>
          </div>

          {/* Google Calendar Card */}
          <div className={`rounded-xl border bg-card/30 p-6 flex flex-col transition-all ${
            isCalendarConnected
              ? 'border-primary/30 ring-1 ring-primary/20 bg-primary/5'
              : 'border-border/40 hover:bg-secondary/10'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 flex items-center justify-center mb-4 border border-[#4285F4]/20">
              <CalendarIcon className="w-6 h-6 text-[#4285F4]" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Google Calendar</h3>
              {isCalendarConnected && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground flex-1 mb-6">
              Connect your calendar to automatically schedule meetings, find availability, and create agendas for upcoming calls.
            </p>

            <div className="flex items-center gap-3 mt-auto">
              {isCalendarConnected ? (
                <Button
                  variant="outline"
                  disabled
                  className="w-full sm:w-auto bg-primary/10 text-primary border-primary/30 pointer-events-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Connected
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleConnectCalendar}
                  className="w-full sm:w-auto"
                >
                  <Link2 className="w-4 h-4 mr-2" /> Connect Calendar
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

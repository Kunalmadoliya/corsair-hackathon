'use client';

import { Mail, Calendar as CalendarIcon, CheckCircle2, Link2, ExternalLink } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';
import { trpc } from '~/trpc/client';
import { usegetUser } from '~/hooks/api/auth/auth';

export function IntegrationsPage() {
  const { toast } = useToast();
  const { user } = usegetUser();

  // Using TRPC hooks for connecting
  const connectGmailMutation = trpc.corsairGmail.connectGmail.useMutation({
    onSuccess: (data) => {
      // Redirect to Google OAuth URL
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to connect Gmail",
        description: error.message,
      });
    }
  });

  const handleConnectGmail = () => {
    if (!user?.id) {
      toast({ variant: "destructive", description: "You must be logged in to connect integrations." });
      return;
    }
    connectGmailMutation.mutate({ id: user.id });
  };

  const handleConnectCalendar = () => {
    toast({
      title: "Coming Soon",
      description: "Calendar integration is currently under development.",
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
          <div className="rounded-xl border border-border/40 bg-card/30 p-6 flex flex-col transition-all hover:bg-secondary/10">
            <div className="w-12 h-12 rounded-2xl bg-[#EA4335]/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#EA4335]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Google Mail</h3>
            <p className="text-sm text-muted-foreground flex-1 mb-6">
              Connect your Gmail account to let Corsair draft responses, summarize long threads, and automatically sort your inbox.
            </p>
            
            <div className="flex items-center gap-3 mt-auto">
              {/* Note: In the future, check if user has connected Gmail and show CheckCircle2 */}
              <Button 
                onClick={handleConnectGmail}
                disabled={connectGmailMutation.isPending}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {connectGmailMutation.isPending ? 'Connecting...' : <><Link2 className="w-4 h-4 mr-2" /> Connect Gmail</>}
              </Button>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="rounded-xl border border-border/40 bg-card/30 p-6 flex flex-col transition-all hover:bg-secondary/10">
            <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 flex items-center justify-center mb-4">
              <CalendarIcon className="w-6 h-6 text-[#4285F4]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Google Calendar</h3>
            <p className="text-sm text-muted-foreground flex-1 mb-6">
              Connect your calendar to automatically schedule meetings, find availability, and create agendas for upcoming calls.
            </p>
            
            <div className="flex items-center gap-3 mt-auto">
              <Button 
                variant="outline"
                onClick={handleConnectCalendar}
                className="w-full sm:w-auto"
              >
                <Link2 className="w-4 h-4 mr-2" /> Connect Calendar
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

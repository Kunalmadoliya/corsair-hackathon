"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Zap, Mail, Calendar, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { usegetUser } from "~/hooks/api/auth/auth";

export default function IntegrationPage() {
  const router = useRouter();
  const { user, isLoading } = usegetUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIntegrated = localStorage.getItem('spamurai_integrations');
      if (isIntegrated === 'true') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleEnterDashboard = () => {
    localStorage.setItem('spamurai_integrations', 'true');
    router.push('/dashboard');
  };

  // Mock states for the frontend UI
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [connectedApps, setConnectedApps] = useState<{
    gmail: boolean;
    calendar: boolean;
  }>({
    gmail: false,
    calendar: false,
  });

  const handleConnect = (app: 'gmail' | 'calendar') => {
    // Simulate an OAuth redirect/connection delay
    setIsConnecting(app);
    setTimeout(() => {
      setConnectedApps(prev => ({ ...prev, [app]: true }));
      setIsConnecting(null);
    }, 1500);
  };

  const hasConnectedApps = connectedApps.gmail || connectedApps.calendar;

  return (
    <main className="min-h-screen w-full bg-background hero-bg flex flex-col items-center justify-center p-6 relative">
      
      {/* Branding */}
      <div className="absolute top-6 left-6 hidden md:flex items-center gap-2 animate-fade-in">
        <Zap className="w-5 h-5 text-primary" />
        <span className="font-bold tracking-tight text-foreground">Spamurai</span>
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-8 relative z-10 animate-slide-up">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Arm your <span className="text-gradient">Spamurai</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Connect your communication stack. Spamurai needs access to these tools to autonomously manage your workflow.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          
          {/* Gmail Card */}
          <Card className={`border-border/40 bg-card/60 backdrop-blur-md shadow-xl card-hover transition-all duration-300 ${connectedApps.gmail ? 'ring-1 ring-primary/30 border-primary/30' : ''}`}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                <Mail className="w-6 h-6 text-red-500" />
              </div>
              <CardTitle className="text-xl">Gmail</CardTitle>
              <CardDescription className="text-base">
                Allow Spamurai to read, draft, and reply to emails on your behalf based on your rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectedApps.gmail ? (
                <Button variant="outline" className="w-full bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors pointer-events-none">
                  <Check className="w-4 h-4 mr-2" /> Connected
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect('gmail')} 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 btn-hover"
                  disabled={isConnecting !== null}
                >
                  {isConnecting === 'gmail' ? 'Connecting...' : 'Connect Gmail'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Google Calendar Card */}
          <Card className={`border-border/40 bg-card/60 backdrop-blur-md shadow-xl card-hover transition-all duration-300 ${connectedApps.calendar ? 'ring-1 ring-primary/30 border-primary/30' : ''}`}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-xl">Google Calendar</CardTitle>
              <CardDescription className="text-base">
                Let Spamurai manage your schedule, check availability, and automatically book meetings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectedApps.calendar ? (
                <Button variant="outline" className="w-full bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors pointer-events-none">
                  <Check className="w-4 h-4 mr-2" /> Connected
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect('calendar')} 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 btn-hover"
                  disabled={isConnecting !== null}
                >
                  {isConnecting === 'calendar' ? 'Connecting...' : 'Connect Calendar'}
                </Button>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center justify-center mt-12 space-y-4">
          <Button 
            size="lg"
            onClick={handleEnterDashboard}
            className={`px-8 btn-hover transition-all duration-300 ${hasConnectedApps ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(0,72%,51%,0.3)]' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {hasConnectedApps ? 'Enter Dashboard' : 'Skip for now'} 
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {!hasConnectedApps && (
            <p className="text-xs text-muted-foreground">
              You can always connect these later in your settings.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trpc } from '~/trpc/client';
import { useToast } from '~/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const hasRun = useRef(false);

  const { mutate: gmailCallback } = trpc.corsairGmail.gmailCallback.useMutation({
    onSuccess: () => {
      utils.auth.getUserWithToken.invalidate();
      toast({
        title: 'Gmail connected',
        description: 'Your Gmail account has been connected successfully.',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Connection failed',
        description: error.message || 'Failed to complete Gmail authorization. Please try again.',
      });
      router.push('/dashboard');
    },
  });

  useEffect(() => {
    // Guard against double-invocation in React Strict Mode
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      toast({
        variant: 'destructive',
        title: 'Invalid callback',
        description: 'Missing OAuth parameters. Please try connecting Gmail again.',
      });
      router.push('/dashboard');
      return;
    }

    gmailCallback({ code, state });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Connecting your Gmail account…</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return <CallbackHandler />;
}
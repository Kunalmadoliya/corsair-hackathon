"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { useToast } from "~/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CallbackHandlerClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const hasRun = useRef(false);
  const [mounted, setMounted] = useState(false);

  const { mutate: calendarCallback } = trpc.corsairCalendar.calendarCallback.useMutation({
    onSuccess: () => {
      utils.auth.getUserWithToken.invalidate();
      toast({
        title: "Calendar connected",
        description: "Your Google Calendar account has been connected successfully.",
      });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message || "Failed to complete Calendar authorization. Please try again.",
      });
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      toast({
        variant: "destructive",
        title: "Invalid callback",
        description: "Missing OAuth parameters. Please try connecting Calendar again.",
      });
      router.push("/dashboard");
      return;
    }

    calendarCallback({ code, state });
  }, [mounted, searchParams, calendarCallback, toast, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Connecting your Google Calendar account…</p>
      </div>
    </div>
  );
}

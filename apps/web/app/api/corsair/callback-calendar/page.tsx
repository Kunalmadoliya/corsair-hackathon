import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CallbackHandlerClient from "./callback-handler-client";

export const dynamic = "force-dynamic";

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </div>
      }
    >
      <CallbackHandlerClient />
    </Suspense>
  );
}

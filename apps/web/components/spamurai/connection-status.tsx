import { usegetUser } from "~/hooks/api/auth/auth";
import { useConnectGmail } from "~/hooks/api/corsair/gmail";
import { Button } from "~/components/ui/button";
import { Mail, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectionStatus() {
  const { user } = usegetUser();
  const { connectGmailAsync, isPending } = useConnectGmail();

  const handleConnect = async () => {
    try {
      const { url } = await connectGmailAsync({});
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Failed to connect", err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 p-6 border border-border/40 bg-card/20 backdrop-blur-md rounded-3xl">
      <h3 className="text-lg font-bold text-zinc-100 mb-2">Integrations</h3>
      <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Mail className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-200">Gmail</h4>
            <p className="text-sm text-zinc-400">Email inbox sync</p>
          </div>
        </div>
        <div>
          {user.isGmailConnected ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <CheckCircle className="w-4 h-4" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnect} disabled={isPending} variant="outline" className="rounded-xl border-zinc-700 hover:bg-zinc-800">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Connect
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-200">Google Calendar</h4>
            <p className="text-sm text-zinc-400">Events & scheduling</p>
          </div>
        </div>
        <div>
          {user.isCalendarConnected ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <CheckCircle className="w-4 h-4" /> Connected
            </div>
          ) : (
            <Button onClick={handleConnect} disabled={isPending} variant="outline" className="rounded-xl border-zinc-700 hover:bg-zinc-800">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

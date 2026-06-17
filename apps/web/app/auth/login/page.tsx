import { Metadata } from "next";
import { Zap } from "lucide-react";
import { LoginForm } from "~/components/auth/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Spamurai account to access your AI Chief of Staff.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen min-w-screen bg-background relative flex justify-center items-center px-6 overflow-hidden font-sans">
      
      {/* Dynamic Grid Background Overlay (Consistent with Landing Page) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Animated Background Globs (Monochromatic) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-foreground/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-foreground/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Decorative Branding Top Left */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3 z-20 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
          <Zap className="w-5 h-5 text-foreground" />
        </div>
        <span className="font-black tracking-tight text-foreground text-xl">Spamurai</span>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
        <LoginForm />
      </div>
    </main>
  );
}
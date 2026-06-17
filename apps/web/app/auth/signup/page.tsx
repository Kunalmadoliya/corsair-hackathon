import { Metadata } from "next";
import { Zap } from "lucide-react";
import { SignupForm } from "~/components/auth/signup-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account on Spamurai to access your AI Chief of Staff.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen min-w-screen bg-background relative flex justify-center items-center px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Decorative Branding Top Left */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-2 z-20">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold tracking-tight text-foreground text-lg">Spamurai</span>
      </div>

      {/* Signup Form Container */}
      <div className="relative z-10 w-full max-w-md my-8">
        <SignupForm />
      </div>
    </main>
  );
}

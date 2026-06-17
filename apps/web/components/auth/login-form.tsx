"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin, useSupportedProviders } from "~/hooks/api/auth/auth";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Shield } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { loginUserEmailAndPasswordAsync, isPending, isError, error } = useLogin();
  const { providers } = useSupportedProviders();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await loginUserEmailAndPasswordAsync({ email, password });
      router.push("/onboarding");
    } catch {
      // error state is handled by the hook
    }
  }

  return (
    <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl animate-fade-in relative z-10 overflow-hidden">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="text-center space-y-1 pb-2 pt-8 px-8">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 animate-float shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome <span className="text-gradient">back</span>
        </h3>
        <p className="text-muted-foreground/80 text-base">
          Sign in to your AI Chief of Staff
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email" className="text-sm font-medium text-foreground/90">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-background/50 border-border/50 focus-visible:ring-primary h-11 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="login-password" className="text-sm font-medium text-foreground/90">
                Password
              </Label>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-background/50 border-border/50 focus-visible:ring-primary h-11 transition-all"
            />
          </div>
        </div>

        {isError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-shake">
            <p className="text-sm text-destructive font-medium text-center">
              {error?.message ?? "Invalid email or password"}
            </p>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 btn-hover font-medium shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            disabled={isPending}
          >
            {isPending ? "Authenticating…" : "Sign in"}
          </Button>

          {/* Separator Line */}
          <div className="relative flex items-center w-full my-2">
            <div className="flex-grow border-t border-border/40" />
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Or
            </span>
            <div className="flex-grow border-t border-border/40" />
          </div>

          {/* OAuth Providers Section */}
          <div className="flex flex-col gap-3 w-full">
            {(!providers || providers.length === 0) && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  window.location.href = "/auth/callback/google";
                }}
                className="w-full h-11 border-border/50 bg-background/50 hover:bg-secondary/80 text-foreground transition-all duration-200"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
                Continue with Google
              </Button>
            )}

            {providers &&
              providers.length > 0 &&
              providers.map((provider) => (
                <Button
                  key={provider.provider}
                  variant="outline"
                  type="button"
                  onClick={() => {
                    window.location.href = provider.authUrl;
                  }}
                  className="w-full h-11 border-border/50 bg-background/50 hover:bg-secondary/80 text-foreground transition-all duration-200 group"
                >
                  {provider.provider === "GOOGLE_OAUTH" ? (
                    <svg
                      className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="github"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                    >
                      <path
                        fill="currentColor"
                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"
                      />
                    </svg>
                  )}
                  Continue with {provider.displayName || "SSO"}
                </Button>
              ))}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:text-primary/85 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}

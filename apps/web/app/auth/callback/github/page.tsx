"use client";

export const dynamic = "force-dynamic";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginWithOAuth } from "~/hooks/api/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const { loginWithOAuthAsync, isPending, isError, error } = useLoginWithOAuth();

  useEffect(() => {
    if (code) {
      loginWithOAuthAsync({ code, provider: "GITHUB_OAUTH" })
        .then(() => {
          router.push("/");
        })
        .catch((err) => {
          console.error("GitHub OAuth login failed:", err);
        });
    }
  }, [code, loginWithOAuthAsync, router]);

  if (errorParam || isError) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            {errorParam || error?.message || "Failed to log in with GitHub. Please try again."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Authenticating with GitHub</CardTitle>
        <CardDescription>
          Please wait while we complete your sign-in process.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </CardContent>
    </Card>
  );
}

export default function GitHubCallbackPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Loading...</CardTitle>
              <CardDescription>Preparing authentication handler.</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <GitHubCallbackContent />
      </Suspense>
    </main>
  );
}

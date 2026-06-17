"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginWithOAuth } from "~/hooks/api/auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const { loginWithOAuthAsync, isError, error } = useLoginWithOAuth();

  const hasCalled = useRef(false);

  useEffect(() => {
    if (code && !hasCalled.current) {
      hasCalled.current = true;
      loginWithOAuthAsync({ code, provider: "GOOGLE_OAUTH" })
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Google OAuth login failed:", err);
        });
    }
  }, [code, loginWithOAuthAsync, router]);

  if (errorParam || isError) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            {errorParam || error?.message || "Failed to log in with Google. Please try again."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Authenticating with Google</CardTitle>
        <CardDescription>Please wait while we complete your sign-in process.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </CardContent>
    </Card>
  );
}

export default function GoogleCallbackClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Loading...</CardTitle>
          <CardDescription>Preparing authentication handler.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
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
      <GoogleCallbackContent />
    </Suspense>
  );
}

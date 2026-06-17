"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyEmail } from "~/hooks/api/auth/auth";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    verifyEmailData,
    isVerifyEmailLoading,
    isVerifyEmailError,
    verifyEmailError,
    isVerifyEmailSuccess,
  } = useVerifyEmail(token);

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Invalid Link</CardTitle>
          <CardDescription>
            No verification token was provided.
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/signup">Go to Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isVerifyEmailLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Verifying Email...
          </CardTitle>

          <CardDescription>
            Please wait while we verify your email.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isVerifyEmailError) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Verification Failed
          </CardTitle>

          <CardDescription className="text-destructive">
            {verifyEmailError?.message ??
              "The verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/signup">Go to Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isVerifyEmailSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Email Verified ✓
          </CardTitle>

          <CardDescription>
            {verifyEmailData?.message ??
              "Your email has been verified successfully."}
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

export default function VerifyEmailClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Loading...</CardTitle>
          <CardDescription>Preparing verification page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">
              Loading...
            </CardTitle>

            <CardDescription>
              Preparing verification page.
            </CardDescription>
          </CardHeader>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

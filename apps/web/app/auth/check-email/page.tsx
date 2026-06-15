"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Check Your Email
          </CardTitle>

          <CardDescription>
            We've sent a verification email to your inbox.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please open your email and click the verification
            link to activate your account.
          </p>

          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam or junk
            folder.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/login">
              Go to Login
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/signup">
              Back to Sign Up
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
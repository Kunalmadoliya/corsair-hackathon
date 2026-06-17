import VerifyEmailClient from "./verify-email-client";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <VerifyEmailClient />
    </main>
  );
}
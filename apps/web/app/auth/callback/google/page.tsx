import GoogleCallbackClient from "./google-callback-client";

export const dynamic = "force-dynamic";

export default function GoogleCallbackPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <GoogleCallbackClient />
    </main>
  );
}

import GitHubCallbackClient from "./github-callback-client";

export const dynamic = "force-dynamic";

export default function GitHubCallbackPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <GitHubCallbackClient />
    </main>
  );
}

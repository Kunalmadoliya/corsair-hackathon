"use client";

import { Dashboard } from "~/components/spamurai/dashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  
  return <Dashboard onBack={() => router.push("/")} />;
}

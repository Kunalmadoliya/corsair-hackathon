import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalProviders } from "~/providers/global";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Spamurai — AI Communication Operating System",
    template: "%s | Spamurai"
  },
  description: "Master communication through conversation. Your AI Chief of Staff for email, scheduling, and workflow automation.",
  keywords: ["AI", "Communication", "Operating System", "Chief of Staff", "Email Management", "Agentic Workflow"],
  authors: [{ name: "Spamurai Team" }],
  creator: "Spamurai",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spamurai.com",
    title: "Spamurai — AI Communication Operating System",
    description: "Master communication through conversation. Your AI Chief of Staff for email, scheduling, and workflow automation.",
    siteName: "Spamurai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spamurai — AI Communication Operating System",
    description: "Master communication through conversation. Your AI Chief of Staff.",
    creator: "@spamurai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
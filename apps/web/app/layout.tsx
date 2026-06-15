import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalProviders } from "~/providers/global";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Spamurai — AI Communication Operating System",
  description:
    "Master communication through conversation. Your AI Chief of Staff.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
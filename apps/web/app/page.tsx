import { Metadata } from 'next';
import { LandingPage } from '~/components/spamurai/landing-page';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spamurai — AI Communication Operating System",
  description: "Join thousands who reclaimed their time. One conversation to control your entire communication stack.",
};

export default function Home() {
  return <LandingPage />;
}
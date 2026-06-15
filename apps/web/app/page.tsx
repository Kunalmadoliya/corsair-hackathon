'use client';

import { useState } from 'react';
import { LandingPage } from '~/components/spamurai/landing-page';
import { Dashboard } from '~/components/spamurai/dashboard';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
}

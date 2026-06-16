'use client';

import { useState } from 'react';
import { LandingPage } from '~/components/spamurai/landing-page';
import { Dashboard } from '~/components/spamurai/dashboard';
import { usegetUser } from '~/hooks/api/auth/auth';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { user} = usegetUser();



  
  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }
  
  if (user) {
    setShowDashboard(true);
  }

 
  

  return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
}

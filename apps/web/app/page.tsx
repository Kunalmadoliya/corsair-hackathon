'use client';

import { useState } from 'react';
import { LandingPage } from '~/components/spamurai/landing-page';
import { Dashboard } from '~/components/spamurai/dashboard';
import { usegetUser } from '~/hooks/api/auth/auth';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { user, isLoading} = usegetUser();


  

  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }
  
  if (user) {
    setShowDashboard(true);
  }

  console.log(user);
  

  return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
}

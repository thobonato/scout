// app/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LandingPage } from './components/LandingPage/LandingPage';

export default async function HomePage() {
  const supabase = await createClient();

  // Securely check if the user is authenticated via Supabase cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If they are logged in, bypass the landing page and go to the dashboard
    redirect('/dashboard');
  }

  // If they are not logged in, show the marketing/landing page
  return <LandingPage />;
}

// app/dashboard/page.tsx

import { BottomNav } from '@/components/BottomNav/BottomNav';
import { PageBackground } from '@/components/PageBackground/PageBackground';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ActionLog } from '@/app/dog/[id]/home/types';
import type { SitterSession } from './types';
import { DogSummary } from './components/DogSummary/DogSummary';
import { RoutineOverview } from './components/RoutineOverview/RoutineOverview';
import { SitterActivityFeed } from './components/SitterActivityFeed/SitterActivityFeed';
import { SitterLink } from './components/SitterLink/SitterLink';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate the user securely on the server
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Redirect to your login or landing page if not authenticated
    redirect('/');
  }

  // 2. Fetch the user's dog. We query the 'pets' table.
  // Your RLS policy "Owner can view own pet" ensures they only see their dogs.
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  const dog = pets?.[0] || null;

  // 3. Fetch logs and sessions only if a dog exists
  // We use Promise.all to fetch these concurrently, drastically improving load times
  // TODO (pet CRUD commit): map Supabase snake_case rows to these camelCase types
  let logs: ActionLog[] = [];
  let sessions: SitterSession[] = [];

  if (dog) {
    const [logsResponse, sessionsResponse] = await Promise.all([
      supabase
        .from('action_logs')
        .select('*')
        .eq('pet_id', dog.id)
        .order('logged_at', { ascending: false }),
      supabase
        .from('sitter_sessions')
        .select('*')
        .eq('pet_id', dog.id)
        .order('created_at', { ascending: false }),
    ]);

    logs = logsResponse.data || [];
    sessions = sessionsResponse.data || [];
  }

  // Handle the empty state exactly as your UI originally designed it
  if (!dog) {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />

        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-4">
          <div className="w-12 h-12 opacity-30">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            No dog profile yet
          </h1>
          <p className="font-nunito text-base text-text-mid max-w-sm">
            Create a profile for your pup to get started.
          </p>
          <Link
            href="/create-dog"
            className="inline-flex items-center gap-2 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors shadow-md"
          >
            <span className="w-4 h-4">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Create Profile
          </Link>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Render the populated dashboard
  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-28 gap-6 max-w-md mx-auto">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/"
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Home
          </Link>
          <h1 className="font-fredoka text-lg font-semibold text-text-dark">
            Dashboard
          </h1>
          <div className="w-12" />
        </div>

        {/* Dog summary */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Note: Ensure the DogSummary component can accept the new Supabase row schema */}
          <DogSummary dog={dog} />
        </div>

        {/* Routine overview */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.2s' }}
        >
          <RoutineOverview dogId={dog.id} />
        </div>

        {/* Sitter links - dynamically using the actual DB ID instead of 'temp' */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.3s' }}
        >
          <SitterLink dogId={dog.id} />
        </div>

        {/* Sitter activity feed */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.4s' }}
        >
          <SitterActivityFeed logs={logs} sessions={sessions} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

// app/dashboard/page.tsx

import { BottomNav } from '@/components/BottomNav/BottomNav';
import { PageBackground } from '@/components/PageBackground/PageBackground';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import type { Pet } from '@/app/create-dog/types';
import type { ActionLog, ActionCategory } from '@/app/dog/[id]/home/types';
import type { SitterSession } from './types';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DogSummary } from './components/DogSummary/DogSummary';
import { RoutineOverview } from './components/RoutineOverview/RoutineOverview';
import { SitterActivityFeed } from './components/SitterActivityFeed/SitterActivityFeed';
import { SitterLink } from './components/SitterLink/SitterLink';

// Raw Supabase row shapes — only the fields we actually use.
interface PetRow {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age_months: number | null;
  weight_lbs: number | null;
  gender: string | null;
  size: string | null;
  coat_color: string | null;
  photo_url: string | null;
  avatar_url: string | null;
  medical_notes: string | null;
  is_spayed_neutered: boolean;
  created_at: string;
  updated_at: string;
}

interface ActionLogRow {
  id: string;
  activity_type: string;
  item_name: string;
  logged_at: string;
  photo_url: string | null;
  session_id: string | null;
}

interface SitterSessionRow {
  id: string;
  pet_id: string;
  sitter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  drop_off_time: string | null;
  pick_up_time: string | null;
  role: 'full_access' | 'view_only';
  is_active: boolean;
  created_at: string;
}

function toPet(row: PetRow): Pet {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    breed: row.breed,
    ageMonths: row.age_months,
    weightLbs: row.weight_lbs,
    gender: (row.gender as Pet['gender']) ?? null,
    size: (row.size as Pet['size']) ?? null,
    coatColor: row.coat_color,
    photoUrl: row.photo_url,
    avatarUrl: row.avatar_url,
    medicalNotes: row.medical_notes,
    isSpayedNeutered: row.is_spayed_neutered,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toActionLog(row: ActionLogRow): ActionLog {
  return {
    id: row.id,
    category: row.activity_type as ActionCategory,
    itemName: row.item_name,
    timestamp: row.logged_at,
    photoUrl: row.photo_url ?? undefined,
    sessionId: row.session_id ?? undefined,
  };
}

function toSitterSession(row: SitterSessionRow): SitterSession {
  return {
    id: row.id,
    petId: row.pet_id,
    sitterId: row.sitter_id,
    ownerId: row.owner_id,
    startDate: row.start_date,
    endDate: row.end_date,
    dropOffTime: row.drop_off_time,
    pickUpTime: row.pick_up_time,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/');
  }

  const { data: petRows } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  const dog = petRows?.[0] ? toPet(petRows[0] as PetRow) : null;

  let logs: ActionLog[] = [];
  let sessions: SitterSession[] = [];

  if (dog) {
    const [logsResponse, sessionsResponse] = await Promise.all([
      supabase
        .from('action_logs')
        .select(
          'id, activity_type, item_name, logged_at, photo_url, session_id'
        )
        .eq('pet_id', dog.id)
        .order('logged_at', { ascending: false }),
      supabase
        .from('sitter_sessions')
        .select('*')
        .eq('pet_id', dog.id)
        .order('created_at', { ascending: false }),
    ]);

    logs = (logsResponse.data ?? []).map((r) => toActionLog(r as ActionLogRow));
    sessions = (sessionsResponse.data ?? []).map((r) =>
      toSitterSession(r as SitterSessionRow)
    );
  }

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

        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.1s' }}
        >
          <DogSummary dog={dog} />
        </div>

        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.2s' }}
        >
          <RoutineOverview dogId={dog.id} />
        </div>

        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: '0.3s' }}
        >
          <SitterLink dogId={dog.id} />
        </div>

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

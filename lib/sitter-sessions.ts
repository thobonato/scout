import { createClient } from '@/lib/supabase/server';
import type { SitterSession } from '@/app/dashboard/types';

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

export async function getSitterSessions(
  petId: string
): Promise<SitterSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sitter_sessions')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SitterSessionRow[]).map(toSitterSession);
}

export async function getSitterSessionById(
  sessionId: string
): Promise<SitterSession | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sitter_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    return null;
  }

  return toSitterSession(data as SitterSessionRow);
}

interface CreateSessionInput {
  petId: string;
  sitterId: string;
  startDate: string;
  endDate: string;
  dropOffTime?: string;
  pickUpTime?: string;
  role?: 'full_access' | 'view_only';
}

export async function createSitterSession(
  input: CreateSessionInput
): Promise<SitterSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('sitter_sessions')
    .insert([
      {
        pet_id: input.petId,
        sitter_id: input.sitterId,
        owner_id: user.id,
        start_date: input.startDate,
        end_date: input.endDate,
        drop_off_time: input.dropOffTime ?? null,
        pick_up_time: input.pickUpTime ?? null,
        role: input.role ?? 'full_access',
        is_active: true,
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toSitterSession(data as SitterSessionRow);
}

export async function revokeSitterSession(sessionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('sitter_sessions')
    .update({ is_active: false })
    .eq('id', sessionId);

  if (error) {
    throw new Error(error.message);
  }
}

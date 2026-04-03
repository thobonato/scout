import { createClient } from '@/lib/supabase/server';
import type { ActionCategory, ActionLog } from '@/app/dog/[id]/home/types';
export { getItemsByCategory } from '@/lib/care-items';

interface ActionLogRow {
  id: string;
  activity_type: string;
  item_name: string;
  logged_at: string;
  photo_url: string | null;
  session_id: string | null;
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

export async function getTodayLogs(petId: string): Promise<ActionLog[]> {
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('action_logs')
    .select('id, activity_type, item_name, logged_at, photo_url, session_id')
    .eq('pet_id', petId)
    .gte('logged_at', todayStart.toISOString())
    .order('logged_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ActionLogRow[]).map(toActionLog);
}

export async function getAllLogs(petId: string): Promise<ActionLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('action_logs')
    .select('id, activity_type, item_name, logged_at, photo_url, session_id')
    .eq('pet_id', petId)
    .order('logged_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ActionLogRow[]).map(toActionLog);
}

export async function logAction(
  petId: string,
  category: ActionCategory,
  itemName: string,
  photoUrl?: string,
  sessionId?: string
): Promise<ActionLog> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('action_logs')
    .insert([
      {
        pet_id: petId,
        logger_id: user.id,
        activity_type: category,
        item_name: itemName,
        logged_at: new Date().toISOString(),
        photo_url: photoUrl ?? null,
        session_id: sessionId ?? null,
      },
    ])
    .select('id, activity_type, item_name, logged_at, photo_url, session_id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toActionLog(data as ActionLogRow);
}

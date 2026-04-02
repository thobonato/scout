/**
 * Daily Logs Queries
 * Handle activity logging and log retrieval
 */

import { supabase } from '@/lib/supabase';
import type { DailyLog } from '@/lib/types/database';

/**
 * Get all logs for a pet created today after midnight local time.
 */
export async function getTodayLogs(petId: string): Promise<DailyLog[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('pet_id', petId)
    .gte('logged_at', today.toISOString())
    .order('logged_at', { ascending: false });

  if (error) {
    console.error("Error fetching today's logs:", error);
    return [];
  }

  return data || [];
}

/**
 * Log a new activity (feeding, walk, medicine, play).
 */
export async function logActivity(
  petId: string,
  loggerId: string,
  activityType: 'feeding' | 'walk' | 'medication' | 'play',
  notes?: string,
  photoUrl?: string
): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from('daily_logs')
    .insert([
      {
        pet_id: petId,
        logger_id: loggerId,
        activity_type: activityType,
        notes,
        photo_url: photoUrl,
        logged_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error logging activity:', error);
    return null;
  }

  return data;
}

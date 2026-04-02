/**
 * User Settings Queries
 * Handle user preference storage
 */

import { supabase } from '@/lib/supabase';
import type { UserSettings } from '@/lib/types/database';

/**
 * Get user settings.
 */
export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user settings:', error);
  }

  return data || null;
}

/**
 * Update user settings.
 */
export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user settings:', error);
    return null;
  }

  return data;
}

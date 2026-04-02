/**
 * Streaks Queries
 * Handle streak tracking per category
 */

import { supabase } from '@/lib/supabase';
import type { Streak } from '@/lib/types/database';

/**
 * Get current streak for a pet in a category.
 */
export async function getStreak(
  petId: string,
  category: 'food' | 'exercise' | 'medicine'
): Promise<Streak | null> {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('pet_id', petId)
    .eq('category', category)
    .single();

  if (error && error.code !== 'PGRST116') {
    // "PGRST116" means no rows found (not an error)
    console.error('Error fetching streak:', error);
  }

  return data || null;
}

/**
 * Get all streaks for a pet.
 */
export async function getStreaks(petId: string): Promise<Streak[]> {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('pet_id', petId);

  if (error) {
    console.error('Error fetching streaks:', error);
    return [];
  }

  return data || [];
}

/**
 * Update streak (called when a task category is completed).
 */
export async function updateStreak(
  petId: string,
  category: 'food' | 'exercise' | 'medicine',
  isConsecutive: boolean
): Promise<Streak | null> {
  const streak = await getStreak(petId, category);
  const today = new Date().toISOString().split('T')[0];

  if (!streak) {
    // First time this category has all tasks done
    const { data, error } = await supabase
      .from('streaks')
      .insert([
        {
          pet_id: petId,
          category,
          current_streak: 1,
          last_completed_date: today,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating streak:', error);
    }
    return data || null;
  }

  // Update existing streak
  const newStreak = isConsecutive ? streak.current_streak + 1 : 1;
  const { data, error } = await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      last_completed_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('id', streak.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating streak:', error);
  }
  return data || null;
}

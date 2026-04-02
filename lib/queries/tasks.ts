/**
 * Daily Tasks Queries
 * Handle tracker tasks and their completion status
 */

import { supabase } from '@/lib/supabase';
import type { DailyTask } from '@/lib/types/database';

/**
 * Get all tasks for a pet on a specific date.
 */
export async function getDailyTasks(
  petId: string,
  date: string
): Promise<DailyTask[]> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('pet_id', petId)
    .eq('date', date)
    .order('time');

  if (error) {
    console.error('Error fetching daily tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Toggle a task's completion status and return the updated task.
 */
export async function toggleTaskCompletion(
  taskId: string,
  isCompleted: boolean
): Promise<DailyTask | null> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling task:', error);
    return null;
  }

  return data;
}

/**
 * Create a new daily task for a pet.
 */
export async function createDailyTask(
  petId: string,
  ownerId: string,
  category: 'food' | 'exercise' | 'medicine',
  label: string,
  date: string,
  time?: string,
  note?: string
): Promise<DailyTask | null> {
  const { data, error } = await supabase
    .from('daily_tasks')
    .insert([
      {
        pet_id: petId,
        owner_id: ownerId,
        category,
        label,
        date,
        time,
        note,
        is_completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
}

/**
 * User Profiles Queries
 * Handle user profile creation and retrieval
 */

import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types/database';

/**
 * Get a user's profile.
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }

  return data || null;
}

/**
 * Get a profile by email.
 */
export async function getProfileByEmail(
  email: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile by email:', error);
  }

  return data || null;
}

/**
 * Create a new user profile (called after signup via Supabase auth trigger).
 */
export async function createUserProfile(
  userId: string,
  email: string,
  displayName: string,
  role: 'owner' | 'sitter' = 'owner'
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        display_name: displayName,
        role,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

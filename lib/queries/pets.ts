/**
 * Pets Queries
 * Handle pet CRUD operations
 */

import { supabase } from '@/lib/supabase';
import type { Pet } from '@/lib/types/database';

/**
 * Get a pet by ID.
 */
export async function getPet(petId: string): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching pet:', error);
  }

  return data || null;
}

/**
 * Get all pets owned by a user.
 */
export async function getUserPets(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at');

  if (error) {
    console.error('Error fetching user pets:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new pet.
 */
export async function createPet(
  ownerId: string,
  name: string,
  species: string,
  breed?: string,
  dateOfBirth?: string,
  gender?: 'male' | 'female' | 'unknown',
  weight?: number,
  avatarUrl?: string
): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('pets')
    .insert([
      {
        owner_id: ownerId,
        name,
        species,
        breed,
        date_of_birth: dateOfBirth,
        gender,
        weight,
        avatar_url: avatarUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating pet:', error);
    return null;
  }

  return data;
}

/**
 * Update a pet's profile.
 */
export async function updatePet(
  petId: string,
  updates: {
    name?: string;
    breed?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'unknown';
    weight?: number;
    coatColor?: string;
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    personality?: string;
    medicalNotes?: string;
    isSpayedNeutered?: boolean;
    avatarUrl?: string;
    healthContext?: string;
  }
): Promise<Pet | null> {
  const updatePayload: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    updatePayload.name = updates.name;
  }
  if (updates.breed !== undefined) {
    updatePayload.breed = updates.breed;
  }
  if (updates.dateOfBirth !== undefined) {
    updatePayload.date_of_birth = updates.dateOfBirth;
  }
  if (updates.gender !== undefined) {
    updatePayload.gender = updates.gender;
  }
  if (updates.weight !== undefined) {
    updatePayload.weight = updates.weight;
  }
  if (updates.coatColor !== undefined) {
    updatePayload.coat_color = updates.coatColor;
  }
  if (updates.size !== undefined) {
    updatePayload.size = updates.size;
  }
  if (updates.personality !== undefined) {
    updatePayload.personality = updates.personality;
  }
  if (updates.medicalNotes !== undefined) {
    updatePayload.medical_notes = updates.medicalNotes;
  }
  if (updates.isSpayedNeutered !== undefined) {
    updatePayload.is_spayed_neutered = updates.isSpayedNeutered;
  }
  if (updates.avatarUrl !== undefined) {
    updatePayload.avatar_url = updates.avatarUrl;
  }
  if (updates.healthContext !== undefined) {
    updatePayload.health_context = updates.healthContext;
  }

  const { data, error } = await supabase
    .from('pets')
    .update(updatePayload)
    .eq('id', petId)
    .select()
    .single();

  if (error) {
    console.error('Error updating pet:', error);
    return null;
  }

  return data;
}

/**
 * Delete a pet and all associated data.
 * Note: This cascades to delete daily logs, tasks, streaks, etc. via Supabase RLS.
 */
export async function deletePet(petId: string): Promise<boolean> {
  const { error } = await supabase.from('pets').delete().eq('id', petId);

  if (error) {
    console.error('Error deleting pet:', error);
    return false;
  }

  return true;
}

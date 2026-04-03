import { createClient } from '@/lib/supabase/server';
import type { DogProfile } from '@/app/create-dog/types';

export interface CreatedPet {
  id: string;
}

export async function createDogProfile(
  profile: DogProfile
): Promise<CreatedPet> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('pets')
    .insert([
      {
        owner_id: user.id,
        name: profile.name,
        breed: profile.breed,
        // age is stored as a year string on the form; DB stores whole months
        age_months: profile.age ? Math.round(Number(profile.age) * 12) : null,
        weight_lbs: profile.weight ? Number(profile.weight) : null,
        gender: profile.gender === 'unknown' ? null : profile.gender,
        size: profile.size ?? null,
        coat_color: profile.coatColor ?? null,
        photo_url: profile.photoUrl || null,
        avatar_url: profile.avatarUrl || null,
        medical_notes: profile.medicalNotes ?? null,
        is_spayed_neutered: profile.isSpayedNeutered ?? false,
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

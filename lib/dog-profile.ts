import { createClient } from '@/lib/supabase/server';
import type {
  DogGender,
  DogProfile,
  DogSize,
  Pet,
} from '@/app/create-dog/types';

// Raw row shape returned by Supabase for the pets table.
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

function toPet(row: PetRow): Pet {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    breed: row.breed,
    ageMonths: row.age_months,
    weightLbs: row.weight_lbs,
    gender: (row.gender as DogGender) ?? null,
    size: (row.size as DogSize) ?? null,
    coatColor: row.coat_color,
    photoUrl: row.photo_url,
    avatarUrl: row.avatar_url,
    medicalNotes: row.medical_notes,
    isSpayedNeutered: row.is_spayed_neutered,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPets(): Promise<Pet[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as PetRow[]).map(toPet);
}

export async function getPetById(id: string): Promise<Pet | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    } // row not found
    throw new Error(error.message);
  }

  return toPet(data as PetRow);
}

export async function createDogProfile(profile: DogProfile): Promise<Pet> {
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
        gender: profile.gender === 'unknown' ? null : (profile.gender ?? null),
        size: profile.size ?? null,
        coat_color: profile.coatColor ?? null,
        photo_url: profile.photoUrl || null,
        avatar_url: profile.avatarUrl || null,
        medical_notes: profile.medicalNotes ?? null,
        is_spayed_neutered: profile.isSpayedNeutered ?? false,
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toPet(data as PetRow);
}

export async function updatePet(
  id: string,
  updates: Partial<DogProfile>
): Promise<Pet> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pets')
    .update({
      ...(updates.name && { name: updates.name }),
      ...(updates.breed !== undefined && { breed: updates.breed }),
      ...(updates.age !== undefined && {
        age_months: updates.age ? Math.round(Number(updates.age) * 12) : null,
      }),
      ...(updates.weight !== undefined && {
        weight_lbs: updates.weight ? Number(updates.weight) : null,
      }),
      ...(updates.gender !== undefined && {
        gender: updates.gender === 'unknown' ? null : updates.gender,
      }),
      ...(updates.size !== undefined && { size: updates.size }),
      ...(updates.coatColor !== undefined && { coat_color: updates.coatColor }),
      ...(updates.photoUrl !== undefined && { photo_url: updates.photoUrl }),
      ...(updates.avatarUrl !== undefined && { avatar_url: updates.avatarUrl }),
      ...(updates.medicalNotes !== undefined && {
        medical_notes: updates.medicalNotes,
      }),
      ...(updates.isSpayedNeutered !== undefined && {
        is_spayed_neutered: updates.isSpayedNeutered,
      }),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toPet(data as PetRow);
}

export async function deletePet(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('pets').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

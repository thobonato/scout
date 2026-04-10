// app/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LandingPage } from './components/LandingPage/LandingPage';
import { OwnerHome } from './components/OwnerHome/OwnerHome';
import type { DogProfile, DogGender, DogSize } from './create-dog/types';

interface PetRow {
  id: string;
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
}

function toDogProfile(row: PetRow): DogProfile {
  return {
    name: row.name,
    breed: row.breed ?? '',
    age: row.age_months ? String(Math.round(row.age_months / 12)) : '',
    photoUrl: row.photo_url ?? '',
    weight: row.weight_lbs ? String(row.weight_lbs) : undefined,
    gender: (row.gender as DogGender) ?? undefined,
    coatColor: row.coat_color ?? undefined,
    size: (row.size as DogSize) ?? undefined,
    medicalNotes: row.medical_notes ?? undefined,
    isSpayedNeutered: row.is_spayed_neutered,
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  const { data: petRows } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  const petRow = petRows?.[0] as PetRow | undefined;

  if (!petRow) {
    redirect('/create-dog');
  }

  const dog = toDogProfile(petRow);

  return <OwnerHome dog={dog} petId={petRow.id} />;
}

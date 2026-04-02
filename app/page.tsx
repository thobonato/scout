'use client';

import type { DogProfile } from '@/types/views';
import { useState } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { OwnerHome } from './components/OwnerHome/OwnerHome';

function loadDogProfile(): DogProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('scout_dog_profile');

  if (!stored) {
    return null;
  }

  return JSON.parse(stored) as DogProfile;
}

export default function Home() {
  const [dog] = useState<DogProfile | null>(loadDogProfile);

  if (!dog) {
    return <LandingPage />;
  }

  return <OwnerHome dog={dog} />;
}

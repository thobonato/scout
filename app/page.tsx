'use client';

import type { DogProfile } from '@/app/create-dog/types';
import { loadDogProfile } from '@/lib/dog-profile';
import { useLayoutEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { OwnerHome } from './components/OwnerHome/OwnerHome';

export default function Home() {
  const [dog, setDog] = useState<DogProfile | null>(null);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDog(loadDogProfile());
  }, []);

  if (!dog) {
    return <LandingPage />;
  }

  return <OwnerHome dog={dog} />;
}

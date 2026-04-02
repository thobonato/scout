'use client';

import { BottomNav } from '@/components/BottomNav/BottomNav';
import { PageBackground } from '@/components/PageBackground/PageBackground';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import type { DogProfile } from '@/types/views';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DogCard } from '../components/DogCard/DogCard';

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

export default function DogProfilePage() {
  const params = useParams();
  const dogId = params.id as string;
  const [dog] = useState<DogProfile | null>(loadDogProfile);

  if (!dog) {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />

        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-4">
          <div className="w-12 h-12 opacity-30">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            No dog profile found
          </h1>
          <p className="font-nunito text-base text-text-mid max-w-sm">
            Create a profile for your pup to get started.
          </p>
          <Link
            href="/create-dog"
            className="inline-flex items-center gap-2 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-6 py-3 rounded-full transition-colors shadow-md"
          >
            <span className="w-4 h-4">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Create Profile
          </Link>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-12 pb-24">
        {/* Back link */}
        <div
          className="animate-fade-up w-full max-w-md mb-8"
          style={{ animationDelay: '0.1s' }}
        >
          <Link
            href={`/dog/${dogId}`}
            className="inline-flex items-center gap-2 font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Home
          </Link>
        </div>

        {/* Success badge */}
        <div
          className="animate-fade-up mb-6"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="font-nunito text-[0.85rem] font-bold tracking-[0.18em] uppercase text-chewy-orange bg-chewy-orange/10 border-[1.5px] border-chewy-orange/25 px-[14px] py-[4px] rounded-full">
            Profile Created
          </span>
        </div>

        {/* Dog card */}
        <div
          className="animate-pop-in w-full max-w-md mb-8"
          style={{ animationDelay: '0.35s' }}
        >
          <DogCard dog={dog} />
        </div>

        {/* Go Home button */}
        <div
          className="animate-fade-up w-full max-w-md"
          style={{ animationDelay: '0.5s' }}
        >
          <Link
            href={`/dog/${dogId}`}
            className="w-full flex items-center justify-center gap-3 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
          >
            <span className="w-5 h-5">
              <PawIcon color="#fff" opacity={1} />
            </span>
            Go Home
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

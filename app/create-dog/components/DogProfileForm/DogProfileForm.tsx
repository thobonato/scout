// app/create-dog/components/DogProfileForm/DogProfileForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PawIcon } from '@/components/PawIcon/PawIcon';
import type { DogGender, DogProfile, DogSize } from '../../types';
import { DogBasicFields } from '../DogBasicFields/DogBasicFields';
import { DogDetailFields } from '../DogDetailFields/DogDetailFields';
import { PhotoUpload } from '../PhotoUpload/PhotoUpload';

export function DogProfileForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<DogGender>('unknown');
  const [size, setSize] = useState<DogSize>('medium');
  const [coatColor, setCoatColor] = useState('');
  const [personality, setPersonality] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [isSpayedNeutered, setIsSpayedNeutered] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // State for handling async API operations
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Please enter your dog's name");
      return;
    }

    if (!breed.trim()) {
      setError("Please enter your dog's breed");
      return;
    }

    setIsSubmitting(true);

    const dogProfile: DogProfile = {
      name: name.trim(),
      breed: breed.trim(),
      age: age.trim(),
      photoUrl,
      weight: weight.trim(),
      gender,
      coatColor: coatColor.trim(),
      size,
      personality: personality.trim(),
      medicalNotes: medicalNotes.trim(),
      isSpayedNeutered,
      avatarUrl,
    };

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogProfile),
      });

      if (!response.ok) {
        const json = (await response.json()) as { error?: string };
        throw new Error(json.error ?? 'Failed to create profile');
      }

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-black/10 bg-warm-white font-nunito text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-chewy-blue/30 focus:border-chewy-blue/40 transition-all';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-6"
    >
      <div className="flex justify-center">
        <PhotoUpload
          photoUrl={photoUrl}
          onPhotoChange={setPhotoUrl}
          onAvatarGenerated={setAvatarUrl}
        />
      </div>

      <DogBasicFields
        name={name}
        onNameChange={setName}
        breed={breed}
        onBreedChange={setBreed}
        age={age}
        onAgeChange={setAge}
        weight={weight}
        onWeightChange={setWeight}
        gender={gender}
        onGenderChange={setGender}
        size={size}
        onSizeChange={setSize}
        coatColor={coatColor}
        onCoatColorChange={setCoatColor}
        inputClasses={inputClasses}
      />

      <div className="border-t border-black/5" />

      <DogDetailFields
        personality={personality}
        onPersonalityChange={setPersonality}
        medicalNotes={medicalNotes}
        onMedicalNotesChange={setMedicalNotes}
        isSpayedNeutered={isSpayedNeutered}
        onSpayedNeuteredChange={setIsSpayedNeutered}
        inputClasses={inputClasses}
      />

      {error && (
        <p className="font-nunito text-sm font-semibold text-red-500 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-3 font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed text-white/80'
            : 'bg-chewy-blue hover:bg-chewy-blue-dark text-white hover:shadow-lg'
        }`}
      >
        {!isSubmitting && (
          <span className="w-5 h-5">
            <PawIcon color="#fff" opacity={1} />
          </span>
        )}
        {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  );
}

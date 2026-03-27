"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "../PhotoUpload/PhotoUpload";
import { DogBasicFields } from "../DogBasicFields/DogBasicFields";
import { DogDetailFields } from "../DogDetailFields/DogDetailFields";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import type { DogProfile, DogGender, DogSize } from "../../types";

export function DogProfileForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<DogGender>("unknown");
  const [size, setSize] = useState<DogSize>("medium");
  const [coatColor, setCoatColor] = useState("");
  const [personality, setPersonality] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [isSpayedNeutered, setIsSpayedNeutered] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your dog's name");
      return;
    }

    if (!breed.trim()) {
      setError("Please enter your dog's breed");
      return;
    }

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

    localStorage.setItem("scout_dog_profile", JSON.stringify(dogProfile));
    router.push("/dog/temp");
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-black/10 bg-warm-white font-nunito text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-chewy-blue/30 focus:border-chewy-blue/40 transition-all";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-6"
    >
      {/* Photo upload */}
      <div className="flex justify-center">
        <PhotoUpload
          photoUrl={photoUrl}
          onPhotoChange={setPhotoUrl}
          onAvatarGenerated={setAvatarUrl}
        />
      </div>

      {/* Basic info */}
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

      {/* Section divider */}
      <div className="border-t border-black/5" />

      {/* Detail fields */}
      <DogDetailFields
        personality={personality}
        onPersonalityChange={setPersonality}
        medicalNotes={medicalNotes}
        onMedicalNotesChange={setMedicalNotes}
        isSpayedNeutered={isSpayedNeutered}
        onSpayedNeuteredChange={setIsSpayedNeutered}
        inputClasses={inputClasses}
      />

      {/* Error message */}
      {error && (
        <p className="font-nunito text-sm font-semibold text-red-500 text-center">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-5 rounded-full transition-colors text-lg shadow-md hover:shadow-lg"
      >
        <span className="w-5 h-5">
          <PawIcon color="#fff" opacity={1} />
        </span>
        Create Profile
      </button>
    </form>
  );
}

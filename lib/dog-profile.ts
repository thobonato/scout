import type { DogProfile } from "@/app/create-dog/types";

export function loadDogProfile(): DogProfile | null {
  const stored = localStorage.getItem("scout_dog_profile");
  if (!stored) {
    return null;
  }
  return JSON.parse(stored) as DogProfile;
}

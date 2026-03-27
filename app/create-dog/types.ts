export type DogGender = "male" | "female" | "unknown";
export type DogSize = "small" | "medium" | "large" | "extra-large";

export interface DogProfile {
  name: string;
  breed: string;
  age: string;
  photoUrl: string;
  weight?: string;
  gender?: DogGender;
  coatColor?: string;
  size?: DogSize;
  personality?: string;
  medicalNotes?: string;
  isSpayedNeutered?: boolean;
  avatarUrl?: string;
}

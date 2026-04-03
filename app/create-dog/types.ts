export type DogGender = 'male' | 'female' | 'unknown';
export type DogSize = 'small' | 'medium' | 'large' | 'extra-large';

// Represents a pet row returned from the database (camelCase mapped from snake_case).
export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  breed: string | null;
  ageMonths: number | null;
  weightLbs: number | null;
  gender: DogGender | null;
  size: DogSize | null;
  coatColor: string | null;
  photoUrl: string | null;
  avatarUrl: string | null;
  medicalNotes: string | null;
  isSpayedNeutered: boolean;
  createdAt: string;
  updatedAt: string;
}

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

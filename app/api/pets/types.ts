// app/api/pets/types.ts

export interface PetCreatePayload {
  name: string;
  breed?: string;
  ageMonths?: number;
  weightLbs?: number;
  gender?: 'male' | 'female';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

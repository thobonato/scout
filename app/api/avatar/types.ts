import type { GenerateAvatarResult } from '@/lib/avatar';

export interface AvatarRequest {
  petId: string;
}

export type AvatarResponse = { data: GenerateAvatarResult } | { error: string };

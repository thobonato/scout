import type { GenerateAvatarResult } from "@/lib/avatar";

export interface AvatarRequest {
  photoDataUrl: string;
}

export type AvatarResponse = { data: GenerateAvatarResult } | { error: string };

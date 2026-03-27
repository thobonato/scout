export interface GenerateAvatarInput {
  photoDataUrl: string;
}

export interface GenerateAvatarResult {
  avatarUrl: string;
}

/**
 * Generates a cartoon avatar from a dog photo.
 * TODO: Integrate with an image generation API.
 * For now, returns the original photo as a placeholder.
 */
export async function generateAvatar(
  input: GenerateAvatarInput,
): Promise<GenerateAvatarResult> {
  return { avatarUrl: input.photoDataUrl };
}

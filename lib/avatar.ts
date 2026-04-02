import { supabase } from '@/lib/supabase';

export interface GenerateAvatarInput {
  photoDataUrl: string;
}

export interface GenerateAvatarResult {
  avatarUrl: string;
}

/**
 * Generates a cartoon avatar from a dog photo using fal.ai.
 * The generated image is uploaded to Supabase storage.
 */
export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarResult> {
  try {
    const falApiKey = process.env.FAL_AI_KEY;

    if (!falApiKey) {
      console.warn(
        'FAL_AI_KEY not configured, returning original photo as placeholder'
      );
      return { avatarUrl: input.photoDataUrl };
    }

    // Call fal.ai to generate cartoon avatar
    const avatarBuffer = await generateAvatarWithFalAI(
      input.photoDataUrl,
      falApiKey
    );

    // Upload to Supabase storage
    const avatarUrl = await uploadAvatarToStorage(avatarBuffer);

    if (!avatarUrl) {
      console.warn('Failed to upload avatar, using original photo');
      return { avatarUrl: input.photoDataUrl };
    }

    return { avatarUrl };
  } catch (error) {
    console.error('Error generating avatar:', error);
    // Fallback: return original photo
    return { avatarUrl: input.photoDataUrl };
  }
}

/**
 * Call fal.ai API to transform photo to cartoon avatar.
 */
async function generateAvatarWithFalAI(
  photoDataUrl: string,
  apiKey: string
): Promise<Buffer> {
  const response = await fetch('https://api.fal.ai/v1/api/avatar', {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: photoDataUrl,
      // Fal.ai avatar parameters for cartoon/cute style
      style: 'cartoon', // cartoon, 3d, illustration
      smile: true,
      glasses: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Fal.ai API error: ${error.message || response.statusText}`
    );
  }

  const data = await response.json();

  // Fal.ai returns a URL to the generated image
  if (!data.image_url) {
    throw new Error('No image URL returned from fal.ai');
  }

  // Fetch the generated image
  const imageResponse = await fetch(data.image_url);
  if (!imageResponse.ok) {
    throw new Error('Failed to fetch generated avatar from fal.ai');
  }

  return Buffer.from(await imageResponse.arrayBuffer());
}

/**
 * Upload avatar to Supabase storage bucket.
 */
async function uploadAvatarToStorage(
  imageBuffer: Buffer
): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-avatar-${Math.random().toString(36).slice(2)}.png`;

    const { data, error } = await supabase.storage
      .from('pet-avatars')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '31536000', // 1 year cache
      });

    if (error) {
      console.error('Error uploading avatar to storage:', error);
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('pet-avatars')
      .getPublicUrl(data.path);

    return publicData?.publicUrl || null;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

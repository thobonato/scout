import { fal } from '@fal-ai/client';
import { createClient } from '@/lib/supabase/server';
import type { Pet } from '@/app/create-dog/types';

// fal.ai picks up FAL_KEY from the environment automatically.

interface FalImage {
  url: string;
  width: number;
  height: number;
}

interface FalResult {
  images: FalImage[];
}

export interface GenerateAvatarInput {
  petId: string;
}

export interface GenerateAvatarResult {
  avatarUrl: string;
}

function buildAvatarPrompt(pet: Pet): string {
  const breed = pet.breed ?? 'dog';
  const color = pet.coatColor ? `${pet.coatColor} coat` : '';
  const size = pet.size ? `${pet.size} sized` : '';

  const traits = [breed, color, size].filter(Boolean).join(', ');

  return (
    `cute cartoon pet avatar, ${traits}, ` +
    'disney pixar style illustration, simple clean background, ' +
    'vibrant warm colors, round friendly face, high quality digital art, ' +
    'sticker style, no text'
  );
}

export async function generateAvatar(
  input: GenerateAvatarInput
): Promise<GenerateAvatarResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch pet profile to build a breed/color-aware prompt.
  const { data: petRow, error: petError } = await supabase
    .from('pets')
    .select('*')
    .eq('id', input.petId)
    .single();

  if (petError || !petRow) {
    throw new Error('Pet not found');
  }

  const pet = petRow as Pet;
  const prompt = buildAvatarPrompt(pet);

  // Generate avatar with FLUX Schnell (~$0.003 per call).
  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt,
      num_inference_steps: 4,
      image_size: 'square_hd',
      num_images: 1,
    },
  });

  const falData = result.data as FalResult;
  const falImageUrl = falData.images[0]?.url;

  if (!falImageUrl) {
    throw new Error('No image returned from fal.ai');
  }

  // Download the generated image and upload to Supabase Storage.
  const imageResponse = await fetch(falImageUrl);
  if (!imageResponse.ok) {
    throw new Error('Failed to download generated image from fal.ai');
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const filename = `${input.petId}/${Date.now()}.png`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filename, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);

  // Persist the avatar URL back to the pet row.
  await supabase
    .from('pets')
    .update({ avatar_url: publicUrl })
    .eq('id', input.petId);

  return { avatarUrl: publicUrl };
}

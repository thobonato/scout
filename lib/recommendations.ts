import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';
import type { Pet } from '@/app/create-dog/types';

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  category: 'food' | 'toy' | 'medicine' | 'accessory';
  chewyUrl: string;
  price: number;
  confidenceScore: number;
  reasonSnippet: string;
}

// Raw shape the LLM is asked to return.
interface LLMProduct {
  name: string;
  brand: string;
  category: string;
  chewyUrl: string;
  price: number;
  confidenceScore: number;
  reasonSnippet: string;
}

function buildPetContext(pet: Pet): string {
  const ageYears = pet.ageMonths ? (pet.ageMonths / 12).toFixed(1) : 'unknown';

  return [
    `Name: ${pet.name}`,
    `Breed: ${pet.breed ?? 'mixed'}`,
    `Age: ${ageYears} years`,
    pet.weightLbs ? `Weight: ${pet.weightLbs} lbs` : null,
    pet.gender ? `Gender: ${pet.gender}` : null,
    pet.size ? `Size: ${pet.size}` : null,
    pet.coatColor ? `Coat: ${pet.coatColor}` : null,
    pet.isSpayedNeutered ? 'Spayed/neutered: yes' : null,
    pet.medicalNotes ? `Medical notes: ${pet.medicalNotes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function getAIRecommendations(
  petId: string
): Promise<ProductRecommendation[]> {
  const supabase = await createClient();

  // Fetch the pet profile for context.
  const { data: petRow, error: petError } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (petError || !petRow) {
    throw new Error('Pet not found');
  }

  const pet = petRow as Pet;

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const client = new Groq();

  const prompt = `You are a Chewy.com product advisor specializing in dog care.
Given this dog's profile, return exactly 6 product recommendations as a JSON array.

Each product must have:
- "name": specific product name (real Chewy product if possible)
- "brand": brand name
- "category": one of "food", "toy", "medicine", "accessory"
- "chewyUrl": a plausible Chewy.com URL (https://www.chewy.com/...)
- "price": realistic USD price as a number (e.g. 24.99)
- "confidenceScore": 0.0–1.0 relevance to this dog
- "reasonSnippet": one sentence explaining why this suits the dog

Include a mix of food, toy, and accessory recommendations.
Format: JSON array only — no markdown, no commentary.

Dog profile:
${buildPetContext(pet)}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content:
          'You are a Chewy.com product advisor. Respond with ONLY valid JSON — no markdown, no code fences.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';
  const cleaned = text
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  const raw = JSON.parse(cleaned) as LLMProduct[];

  // Cache results in Supabase for the pet (delete old, insert fresh).
  const rows = raw.map((p) => ({
    pet_id: petId,
    category: p.category,
    name: p.name,
    description: p.reasonSnippet,
    chewy_link: p.chewyUrl,
    confidence: p.confidenceScore,
  }));

  await supabase.from('product_recommendations').delete().eq('pet_id', petId);

  await supabase.from('product_recommendations').insert(rows);

  return raw.map((p, i) => ({
    id: `rec-${i}`,
    name: p.name,
    brand: p.brand,
    category: p.category as ProductRecommendation['category'],
    chewyUrl: p.chewyUrl,
    price: p.price,
    confidenceScore: p.confidenceScore,
    reasonSnippet: p.reasonSnippet,
  }));
}

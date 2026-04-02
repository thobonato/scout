import { supabase } from '@/lib/supabase';
import type { Pet } from '@/lib/types/database';

/**
 * Product recommendation from LLM analysis.
 */
export interface ProductRecommendation {
  name: string;
  brand: string;
  price: string;
  chewyUrl: string;
  confidenceScore: number;
  reasonSnippet: string;
}

/**
 * LLM response structure for recommendations.
 */
interface LLMRecommendationResponse {
  recommendations: ProductRecommendation[];
}

/**
 * Get cached recommendations for a pet, or generate new ones if expired.
 */
export async function getOrGenerateRecommendations(
  petId: string,
  pet: Pet
): Promise<ProductRecommendation[]> {
  // Check for cached recommendations that haven't expired
  const { data: cached } = await supabase
    .from('product_recommendations')
    .select('*')
    .eq('pet_id', petId)
    .gt('expires_at', new Date().toISOString())
    .limit(10);

  if (cached && cached.length > 0) {
    return cached.map((rec) => ({
      name: rec.name,
      brand: rec.brand,
      price: rec.price,
      chewyUrl: rec.chewy_url,
      confidenceScore: rec.confidence_score,
      reasonSnippet: rec.reason_snippet,
    }));
  }

  // Generate new recommendations using LLM
  const recommendations = await generateRecommendations(pet);

  if (recommendations.length > 0) {
    // Cache in database with 30-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const recordsToInsert = recommendations.map((rec) => ({
      pet_id: petId,
      name: rec.name,
      brand: rec.brand,
      price: rec.price,
      chewy_url: rec.chewyUrl,
      confidence_score: rec.confidenceScore,
      reason_snippet: rec.reasonSnippet,
      expires_at: expiresAt.toISOString(),
    }));

    await supabase.from('product_recommendations').insert(recordsToInsert);
  }

  return recommendations;
}

/**
 * Generate product recommendations using OpenRouter LLM.
 */
async function generateRecommendations(
  pet: Pet
): Promise<ProductRecommendation[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return [];
  }

  const prompt = buildRecommendationPrompt(pet);

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://scout-pet.vercel.app',
          'X-Title': 'Scout Pet Care',
        },
        body: JSON.stringify({
          model: 'groq/mixtral-8x7b-32768', // Fast, open-source via Groq
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter API error:', error);
      return [];
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from LLM response');
      return [];
    }

    const parsed: LLMRecommendationResponse = JSON.parse(jsonMatch[0]);
    return parsed.recommendations || [];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

/**
 * Build a detailed prompt for the LLM to generate pet product recommendations.
 */
function buildRecommendationPrompt(pet: Pet): string {
  return `You are a pet nutrition and wellness expert. Analyze this dog's profile and recommend 3-5 specific products from Chewy.com that would improve their health and happiness.

DOG PROFILE:
- Name: ${pet.name}
- Breed: ${pet.breed || 'Mixed'}
- Age: ${calculateAge(pet.date_of_birth)} years
- Weight: ${pet.weight || 'Unknown'} lbs
- Size: ${pet.size || 'Medium'}
- Health/Notes: ${pet.medical_notes || 'No specific health issues'}
${pet.personality ? `- Personality: ${pet.personality}` : ''}

Based on this profile, recommend specific food, supplement, toy, or other products that would benefit this dog. For each recommendation:
1. Product name and brand
2. Approximate price (estimate if needed)
3. Chewy.com product URL (format: https://www.chewy.com/s/search-term)
4. Confidence score 0-1 (1 = highly recommended)
5. Brief reason why this product is good for this dog

RESPOND ONLY WITH THIS JSON FORMAT (no other text):
{
  "recommendations": [
    {
      "name": "Product Name",
      "brand": "Brand Name",
      "price": "$XX.XX",
      "chewyUrl": "https://www.chewy.com/...",
      "confidenceScore": 0.9,
      "reasonSnippet": "Why this product is good for ${pet.name}..."
    }
  ]
}`;
}

/**
 * Calculate dog's age in years from date of birth.
 */
function calculateAge(dateOfBirth?: string): number {
  if (!dateOfBirth) {
    return 0;
  }

  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

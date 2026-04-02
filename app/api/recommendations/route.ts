import { getOrGenerateRecommendations } from '@/lib/healthcare/recommendations';
import { getPet } from '@/lib/queries/pets';
import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  chewyUrl: string;
  price: number;
  originalPrice?: number;
  confidenceScore: number;
  reasonSnippet: string;
}

interface GetRecommendationsResponse {
  data?: RecommendedProduct[];
  error?: string;
}

// ---------------------------------------------------------------------------
// GET /api/recommendations?petId=...
// ---------------------------------------------------------------------------
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetRecommendationsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  // Get pet details for context
  const pet = await getPet(petId);

  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  // Get or generate recommendations from LLM
  const recommendations = await getOrGenerateRecommendations(petId, pet);

  // Transform to API response format
  const data: RecommendedProduct[] = recommendations.map((rec, index) => ({
    id: `rec-${petId}-${index}`,
    name: rec.name,
    brand: rec.brand,
    imageUrl: '', // TODO: Can add Chewy image scraping or placeholder
    chewyUrl: rec.chewyUrl,
    price: parseFloat(rec.price.replace(/[^0-9.]/g, '')),
    confidenceScore: rec.confidenceScore,
    reasonSnippet: rec.reasonSnippet,
  }));

  return NextResponse.json({ data });
}

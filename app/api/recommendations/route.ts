import { type NextRequest, NextResponse } from 'next/server';
import { getAIRecommendations } from '@/lib/recommendations';
import type { ProductRecommendation } from '@/lib/recommendations';
import { RateLimitError } from 'groq-sdk';

interface GetRecommendationsResponse {
  data?: ProductRecommendation[];
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetRecommendationsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  try {
    const recommendations = await getAIRecommendations(petId);
    return NextResponse.json({ data: recommendations });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: 'Too many requests — please wait a moment and try again.' },
        { status: 429 }
      );
    }
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Pet not found' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import { type NextRequest, NextResponse } from 'next/server';
import { getHealthInsights, RateLimitError } from '@/lib/health-insights';
import type { HealthInsight } from '@/lib/health-insights';

interface GetHealthInsightsResponse {
  data?: { insights: HealthInsight[] };
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GetHealthInsightsResponse>> {
  let petId: string | undefined;

  try {
    const body = (await request.json()) as { petId?: string };
    petId = body.petId;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  try {
    const insights = await getHealthInsights(petId);
    return NextResponse.json({ data: { insights } });
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

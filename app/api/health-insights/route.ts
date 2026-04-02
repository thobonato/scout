import { generateHealthInsights } from '@/lib/healthcare/health-insights';
import { getPet } from '@/lib/queries/pets';
import type { GetHealthInsightsResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/health-insights?petId=...
 * Generate weekly health insights for a pet based on activity logs.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetHealthInsightsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  // Get pet details
  const pet = await getPet(petId);

  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  // Generate health insights from activity logs
  const insights = await generateHealthInsights(petId, pet);

  return NextResponse.json({ data: insights });
}

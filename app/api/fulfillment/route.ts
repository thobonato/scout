import { getTodayLogs } from '@/lib/queries/logs';
import type { GetFulfillmentResponse } from '@/types/api';
import { NextResponse, type NextRequest } from 'next/server';

// Daily goals (MVP: hardcoded, can be made configurable per pet)
const DAILY_GOALS = {
  feeding: 3,
  walk: 2,
  medication: 1,
};

/**
 * GET /api/fulfillment?petId=...
 * Calculate how well the pet's daily care needs are being met.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetFulfillmentResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  const logs = await getTodayLogs(petId);

  // Count activities by type
  const feedingCount = logs.filter(
    (log) => log.activity_type === 'feeding'
  ).length;
  const walkCount = logs.filter((log) => log.activity_type === 'walk').length;
  const medicationCount = logs.filter(
    (log) => log.activity_type === 'medication'
  ).length;

  // Calculate fulfillment percentages (0-100, capped at 100)
  const hunger = Math.min(
    100,
    Math.round((feedingCount / DAILY_GOALS.feeding) * 100)
  );
  const exercise = Math.min(
    100,
    Math.round((walkCount / DAILY_GOALS.walk) * 100)
  );
  const medicine = Math.min(
    100,
    Math.round((medicationCount / DAILY_GOALS.medication) * 100)
  );

  return NextResponse.json({
    data: { hunger, exercise, medicine },
  });
}

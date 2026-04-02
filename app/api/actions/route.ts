import { getTodayLogs, logActivity } from '@/lib/queries/logs';
import type { GetActionsResponse, LogActionResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/actions?petId=...
 * Fetch all activities logged for a pet today.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetActionsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  const logs = await getTodayLogs(petId);
  return NextResponse.json({ data: logs });
}

/**
 * POST /api/actions
 * Log a new activity (feeding, walk, medication, play).
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<LogActionResponse>> {
  const body = await request.json();

  if (!body.petId || !body.activityType) {
    return NextResponse.json(
      { error: 'petId and activityType are required' },
      { status: 400 }
    );
  }

  const validTypes = ['feeding', 'walk', 'medication', 'play'];

  if (!validTypes.includes(body.activityType)) {
    return NextResponse.json(
      {
        error: 'activityType must be feeding, walk, medication, or play',
      },
      { status: 400 }
    );
  }

  // TODO: Get userId from auth session (Supabase auth)
  // For now, using a placeholder loggerId
  const loggerId = body.loggerId || 'temp-user-id';

  const log = await logActivity(
    body.petId,
    loggerId,
    body.activityType,
    body.notes,
    body.photoUrl
  );

  if (!log) {
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: log });
}

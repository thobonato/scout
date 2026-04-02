import {
  endSitterSession,
  getActiveSitterSessions,
} from '@/lib/queries/sitters';
import type {
  EndSessionRequest,
  EndSessionResponse,
  GetSessionsResponse,
} from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/sitters/sessions?petId=...
 * Fetch active sitter sessions for a pet (owner action).
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetSessionsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json(
      { error: 'Missing petId query parameter' },
      { status: 400 }
    );
  }

  // Fetch active sessions
  const activeSessions = await getActiveSitterSessions(petId);

  return NextResponse.json({
    data: activeSessions,
  });
}

/**
 * PATCH /api/sitters/sessions
 * End a sitter session (owner revokes caregiver access).
 */
export async function PATCH(
  request: NextRequest
): Promise<NextResponse<EndSessionResponse>> {
  const body = (await request.json()) as Partial<EndSessionRequest>;

  if (!body.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const success = await endSitterSession(body.sessionId);

  if (!success) {
    return NextResponse.json(
      { error: 'Failed to end session' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

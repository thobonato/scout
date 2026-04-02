import { acceptSitterInvite } from '@/lib/queries/sitters';
import type { AcceptInviteRequest, AcceptInviteResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/sitters/accept
 * Accept a sitter invite using the token.
 * Creates a sitter session and establishes caregiving permissions.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AcceptInviteResponse>> {
  const body = (await request.json()) as Partial<AcceptInviteRequest>;

  if (!body.token || !body.sitterId) {
    return NextResponse.json(
      { error: 'Missing token or sitterId' },
      { status: 400 }
    );
  }

  const { sessionId, error } = await acceptSitterInvite(
    body.token,
    body.sitterId,
    body.sitterEmail || ''
  );

  if (error || !sessionId) {
    return NextResponse.json(
      { error: error || 'Failed to accept invite' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: {
      sessionId,
      message: 'Invite accepted successfully. You can now log activities.',
    },
  });
}

import { type NextRequest, NextResponse } from 'next/server';
import { acceptInvite } from '@/lib/sitter-invites';

export async function POST(request: NextRequest): Promise<NextResponse> {
  let token: string;

  try {
    const body = (await request.json()) as { token?: string };
    token = body.token ?? '';
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    await acceptInvite(token);
    return NextResponse.json({ data: { accepted: true } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    let status = 500;
    if (message === 'Unauthorized') {
      status = 401;
    } else if (
      message.includes('claimed') ||
      message.includes('expired') ||
      message.includes('email')
    ) {
      status = 400;
    } else if (message === 'Invite not found or expired') {
      status = 404;
    }
    return NextResponse.json({ error: message }, { status });
  }
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  getSitterSessionById,
  revokeSitterSession,
} from '@/lib/sitter-sessions';
import type { SitterSession } from '@/app/dashboard/types';

type GetSessionResponse = { data: SitterSession } | { error: string };

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetSessionResponse>> {
  const { id } = await params;

  try {
    const session = await getSitterSessionById(id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ data: session });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await revokeSitterSession(id);
    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

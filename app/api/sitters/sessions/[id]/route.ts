import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { revokeSitterSession } from '@/lib/sitter-sessions';

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

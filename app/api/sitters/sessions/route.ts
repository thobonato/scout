import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSitterSessions } from '@/lib/sitter-sessions';

export async function GET(request: NextRequest) {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'petId is required' }, { status: 400 });
  }

  try {
    const sessions = await getSitterSessions(petId);
    return NextResponse.json({ data: sessions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

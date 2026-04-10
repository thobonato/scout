import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAllLogs, getTodayLogs, logAction } from '@/lib/actions';
import type { GetActionsResponse, LogActionResponse } from './types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetActionsResponse>> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  const all = request.nextUrl.searchParams.get('all') === 'true';

  try {
    const logs = all ? await getAllLogs(petId) : await getTodayLogs(petId);
    return NextResponse.json({ data: logs });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LogActionResponse>> {
  const body = await request.json();

  if (!body.petId || !body.category || !body.itemName) {
    return NextResponse.json(
      { error: 'petId, category, and itemName are required' },
      { status: 400 }
    );
  }

  const validCategories = ['feed', 'play', 'medicine'];
  if (!validCategories.includes(body.category)) {
    return NextResponse.json(
      { error: 'category must be feed, play, or medicine' },
      { status: 400 }
    );
  }

  try {
    const log = await logAction(
      body.petId,
      body.category,
      body.itemName,
      body.photoUrl,
      body.sessionId
    );
    return NextResponse.json({ data: log });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateAvatar } from '@/lib/avatar';
import type { AvatarResponse } from './types';

export async function POST(
  request: NextRequest
): Promise<NextResponse<AvatarResponse>> {
  const body = await request.json();

  if (!body.petId || typeof body.petId !== 'string') {
    return NextResponse.json({ error: 'petId is required' }, { status: 400 });
  }

  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { error: 'FAL_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const result = await generateAvatar({ petId: body.petId });
    return NextResponse.json({ data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    let status = 500;
    if (message === 'Unauthorized') {
      status = 401;
    } else if (message === 'Pet not found') {
      status = 404;
    }
    return NextResponse.json({ error: message }, { status });
  }
}

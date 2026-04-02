import { generateAvatar } from '@/lib/avatar';
import type { AvatarResponse } from '@/types/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/avatar
 * Generate a cartoon avatar from a dog photo.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AvatarResponse>> {
  const body = await request.json();

  if (!body.photoDataUrl || typeof body.photoDataUrl !== 'string') {
    return NextResponse.json(
      { error: 'photoDataUrl is required and must be a string' },
      { status: 400 }
    );
  }

  try {
    const result = await generateAvatar({ photoDataUrl: body.photoDataUrl });
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Avatar generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}

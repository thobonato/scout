import { type NextRequest, NextResponse } from 'next/server';
import { createInvite, getOwnerInvites } from '@/lib/sitter-invites';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const petId = request.nextUrl.searchParams.get('petId');

  if (!petId) {
    return NextResponse.json({ error: 'Missing petId' }, { status: 400 });
  }

  try {
    const invites = await getOwnerInvites(petId);
    return NextResponse.json({ data: invites });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  if (!body.email || !body.role || !body.petId) {
    return NextResponse.json(
      { error: 'Missing email, role, or petId' },
      { status: 400 }
    );
  }

  const validRoles = ['full_access', 'view_only'];
  if (!validRoles.includes(body.role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    const invite = await createInvite({
      petId: body.petId,
      email: body.email,
      role: body.role,
    });
    return NextResponse.json({ data: invite }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

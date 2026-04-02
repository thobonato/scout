import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SitterInviteBody {
  email: string;
  role: 'full_access' | 'view_only';
  petId: string;
}

interface SitterInviteResponse {
  data?: { inviteId: string; email: string };
  error?: string;
}

// ---------------------------------------------------------------------------
// POST /api/sitters/invite
// ---------------------------------------------------------------------------
export async function POST(
  request: NextRequest
): Promise<NextResponse<SitterInviteResponse>> {
  const body = (await request.json()) as Partial<SitterInviteBody>;

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

  // TODO: Extract userId from Supabase auth session
  const ownerId = 'temp-user-id';

  // Generate unique invite token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const { data, error } = await supabase
    .from('sitter_invites')
    .insert([
      {
        owner_id: ownerId,
        pet_id: body.petId,
        email: body.email,
        role: body.role,
        token,
        permissions_scope:
          body.role === 'full_access'
            ? ['read:pet', 'write:log', 'read:logs']
            : ['read:pet', 'read:logs'],
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create invite' },
      { status: 500 }
    );
  }

  // TODO: Send invite email with link to accept-invite page
  // const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;
  // await sendEmail({ to: body.email, subject: "...", html: `...` });

  return NextResponse.json({
    data: { inviteId: data.id, email: body.email },
  });
}

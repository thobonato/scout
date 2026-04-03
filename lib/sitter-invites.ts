import { randomBytes } from 'crypto';
import { createClient } from '@/lib/supabase/server';

export interface SitterInvite {
  id: string;
  petId: string;
  ownerId: string;
  token: string;
  email: string;
  role: 'full_access' | 'view_only';
  isClaimed: boolean;
  expiresAt: string;
  createdAt: string;
}

interface SitterInviteRow {
  id: string;
  pet_id: string;
  owner_id: string;
  invite_token: string;
  invite_email: string;
  role: 'full_access' | 'view_only';
  accepted_by_id: string | null;
  is_claimed: boolean;
  expires_at: string;
  created_at: string;
}

function toSitterInvite(row: SitterInviteRow): SitterInvite {
  return {
    id: row.id,
    petId: row.pet_id,
    ownerId: row.owner_id,
    token: row.invite_token,
    email: row.invite_email,
    role: row.role,
    isClaimed: row.is_claimed,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export async function createInvite(params: {
  petId: string;
  email: string;
  role: 'full_access' | 'view_only';
  expiryDays?: number;
}): Promise<SitterInvite> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (params.expiryDays ?? 7));

  const { data, error } = await supabase
    .from('sitter_invites')
    .insert([
      {
        pet_id: params.petId,
        owner_id: user.id,
        invite_token: token,
        invite_email: params.email.toLowerCase().trim(),
        role: params.role,
        is_claimed: false,
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toSitterInvite(data as SitterInviteRow);
}

export async function getInviteByToken(
  token: string
): Promise<SitterInvite | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('invite_token', token)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return toSitterInvite(data as SitterInviteRow);
}

export async function getOwnerInvites(petId: string): Promise<SitterInvite[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SitterInviteRow[]).map(toSitterInvite);
}

export async function acceptInvite(token: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('invite_token', token)
    .single();

  if (inviteError || !inviteData) {
    throw new Error('Invite not found or expired');
  }

  const invite = inviteData as SitterInviteRow;

  if (invite.is_claimed) {
    throw new Error('This invite has already been accepted');
  }
  if (new Date(invite.expires_at) < new Date()) {
    throw new Error('This invite has expired');
  }
  if (invite.invite_email !== user.email?.toLowerCase()) {
    throw new Error('This invite was sent to a different email address');
  }

  // Session runs from today until the invite expiry date.
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date(invite.expires_at).toISOString().split('T')[0];

  const { error: sessionError } = await supabase
    .from('sitter_sessions')
    .insert([
      {
        pet_id: invite.pet_id,
        sitter_id: user.id,
        owner_id: invite.owner_id,
        start_date: today,
        end_date: endDate,
        role: invite.role,
        is_active: true,
      },
    ]);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: claimError } = await supabase
    .from('sitter_invites')
    .update({ is_claimed: true, accepted_by_id: user.id })
    .eq('invite_token', token);

  if (claimError) {
    throw new Error(claimError.message);
  }
}

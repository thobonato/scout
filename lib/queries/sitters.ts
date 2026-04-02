/**
 * Sitter Management Queries
 * Handle sitter invites and sessions (multi-user caregiving)
 */

import { supabase } from '@/lib/supabase';

/**
 * Get a sitter invite by token (for accepting invites).
 */
export async function getSitterInviteByToken(token: string) {
  const { data, error } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching sitter invite:', error);
  }

  return data || null;
}

/**
 * Get a sitter invite by ID.
 */
export async function getSitterInvite(inviteId: string) {
  const { data, error } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('id', inviteId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching sitter invite:', error);
  }

  return data || null;
}

/**
 * Get all sitter invites for a pet (owned by owner).
 */
export async function getSitterInvitesForPet(petId: string) {
  const { data, error } = await supabase
    .from('sitter_invites')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sitter invites:', error);
    return [];
  }

  return data || [];
}

/**
 * Accept a sitter invite - creates a profile and sitter session.
 */
export async function acceptSitterInvite(
  token: string,
  sitterId: string,
  _sitterEmail: string
): Promise<{ sessionId: string | null; error?: string }> {
  // Get the invite
  const invite = await getSitterInviteByToken(token);

  if (!invite) {
    return { sessionId: null, error: 'Invite not found or expired' };
  }

  // Create sitter session
  const { data: session, error: sessionError } = await supabase
    .from('sitter_sessions')
    .insert([
      {
        pet_id: invite.pet_id,
        sitter_id: sitterId,
        invite_id: invite.id,
        start_date: new Date().toISOString().split('T')[0],
        permissions_scope: invite.permissions_scope,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating sitter session:', sessionError);
    return { sessionId: null, error: 'Failed to create session' };
  }

  // Mark invite as used
  await supabase
    .from('sitter_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id);

  return { sessionId: session?.id || null };
}

/**
 * Revoke a sitter invite (owner action).
 */
export async function revokeSitterInvite(inviteId: string): Promise<boolean> {
  const { error } = await supabase
    .from('sitter_invites')
    .update({ expires_at: new Date().toISOString() })
    .eq('id', inviteId);

  if (error) {
    console.error('Error revoking sitter invite:', error);
    return false;
  }

  return true;
}

/**
 * Get active sitter sessions for a pet.
 */
export async function getActiveSitterSessions(petId: string) {
  const { data, error } = await supabase
    .from('sitter_sessions')
    .select('*')
    .eq('pet_id', petId)
    .eq('is_active', true)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching sitter sessions:', error);
    return [];
  }

  return data || [];
}

/**
 * End a sitter session (owner action).
 */
export async function endSitterSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('sitter_sessions')
    .update({
      is_active: false,
      end_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error ending sitter session:', error);
    return false;
  }

  return true;
}

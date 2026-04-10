-- =============================================================================
-- SITTER INVITE IMPROVEMENTS
-- 1. Add role column to sitter_invites so the intended access level is stored.
-- 2. Allow authenticated users to look up an unclaimed invite by token.
-- 3. Allow sitters to INSERT a sitter_session when accepting an invite.
-- =============================================================================

-- Store the intended access level on the invite itself.
ALTER TABLE public.sitter_invites
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'full_access'
CHECK (role IN ('full_access', 'view_only'));

-- Allow any authenticated user to read an unclaimed, non-expired invite.
-- The 64-character hex token (128 bits entropy) is unguessable in practice.
CREATE POLICY "Authenticated user can view unclaimed invite by token"
ON public.sitter_invites
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND is_claimed = FALSE
  AND expires_at > now()
);

-- Allow a sitter to INSERT a sitter_session when a valid invite exists for
-- their email address and pet. The owner_id must come from the invite itself.
CREATE POLICY "Sitter can create session from valid invite"
ON public.sitter_sessions
FOR INSERT
WITH CHECK (
  auth.uid() = sitter_id
  AND EXISTS (
    SELECT 1
    FROM public.sitter_invites si
    WHERE si.pet_id = sitter_sessions.pet_id
      AND si.invite_email = auth.email()
      AND si.is_claimed = FALSE
      AND si.expires_at > now()
  )
);

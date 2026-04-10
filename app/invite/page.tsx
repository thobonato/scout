import { createClient } from '@/lib/supabase/server';
import { getInviteByToken } from '@/lib/sitter-invites';
import { redirect } from 'next/navigation';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import { AcceptInviteButton } from './components/AcceptInviteButton';

interface InvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitePage({ searchParams }: InvitePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <ErrorState message="This invite link is missing a token." />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=Please sign in to accept this invite`);
  }

  const invite = await getInviteByToken(token);

  if (!invite) {
    return <ErrorState message="This invite link is invalid or has expired." />;
  }
  if (invite.isClaimed) {
    return <ErrorState message="This invite has already been accepted." />;
  }

  const roleLabel = invite.role === 'full_access' ? 'Full Access' : 'View Only';

  return (
    <div className="min-h-screen bg-page flex items-center justify-center font-nunito px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm border border-black/5 flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 animate-wag">
          <PawIcon color="var(--chewy-blue)" opacity={1} />
        </div>

        <div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            You&apos;re invited!
          </h1>
          <p className="font-nunito text-sm text-text-mid mt-2 leading-relaxed">
            You&apos;ve been invited to help care for a pet with{' '}
            <span className="font-semibold text-text-dark">{roleLabel}</span>{' '}
            permissions.
          </p>
          <p className="font-nunito text-xs text-text-muted mt-3">
            Expires{' '}
            {new Date(invite.expiresAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <AcceptInviteButton token={token} />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center font-nunito px-6">
      <div className="w-full max-w-sm text-center">
        <p className="font-nunito text-base text-text-mid">{message}</p>
      </div>
    </div>
  );
}

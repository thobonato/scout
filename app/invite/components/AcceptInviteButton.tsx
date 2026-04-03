'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AcceptInviteButtonProps {
  token: string;
}

export function AcceptInviteButton({ token }: AcceptInviteButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAccept() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sitters/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const json = (await response.json()) as { error?: string };
        throw new Error(json.error ?? 'Failed to accept invite');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {error && (
        <p className="font-nunito text-sm text-red-500 text-center">{error}</p>
      )}
      <button
        onClick={handleAccept}
        disabled={isLoading}
        className={`w-full py-4 rounded-full font-nunito font-bold text-lg transition-colors shadow-md ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed text-white/80'
            : 'bg-chewy-blue hover:bg-chewy-blue-dark text-white'
        }`}
      >
        {isLoading ? 'Accepting…' : 'Accept Invite'}
      </button>
    </div>
  );
}

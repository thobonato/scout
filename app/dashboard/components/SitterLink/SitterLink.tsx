'use client';

import { useState, useEffect } from 'react';
import { Link2, Trash2, Calendar } from 'lucide-react';
import type { SitterSession } from '../../types';

interface SitterLinkProps {
  dogId: string;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  if (start === end) {
    return startDate.toLocaleDateString('en-US', opts);
  }

  return `${startDate.toLocaleDateString('en-US', opts)} – ${endDate.toLocaleDateString('en-US', opts)}`;
}

export function SitterLink({ dogId }: SitterLinkProps) {
  const [sessions, setSessions] = useState<SitterSession[]>([]);

  useEffect(() => {
    fetch(`/api/sitters/sessions?petId=${dogId}`)
      .then((res) => res.json())
      .then((body: { data?: SitterSession[] }) => {
        if (body.data) {
          setSessions(body.data.filter((s) => s.isActive));
        }
      })
      .catch(() => {});
  }, [dogId]);

  async function handleRevoke(sessionId: string): Promise<void> {
    await fetch(`/api/sitters/sessions/${sessionId}`, { method: 'PATCH' });
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }

  return (
    <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
          Active Sitter Sessions
        </h3>
      </div>

      {sessions.length === 0 ? (
        <p className="font-nunito text-sm text-text-muted/60 text-center py-4">
          No active sitter sessions. Invite a sitter from Settings.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <div key={session.id} className="py-3 px-4 bg-cream rounded-xl">
              <div className="flex items-center gap-3">
                <Link2 size={16} className="text-chewy-blue flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <span className="font-nunito text-sm font-semibold text-text-dark block capitalize">
                    {session.role === 'full_access'
                      ? 'Full Access'
                      : 'View Only'}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Calendar size={11} className="text-text-muted" />
                    <span className="font-nunito text-xs text-text-muted">
                      {formatDateRange(session.startDate, session.endDate)}
                      {session.dropOffTime && session.pickUpTime
                        ? ` · ${session.pickUpTime} – ${session.dropOffTime}`
                        : ''}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRevoke(session.id)}
                  className="p-2 rounded-lg hover:bg-chewy-orange/10 transition-colors"
                  title="Revoke session"
                >
                  <Trash2
                    size={16}
                    className="text-text-muted hover:text-chewy-orange"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

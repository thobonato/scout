'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import { PageBackground } from '@/components/PageBackground/PageBackground';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import type { SitterSession } from '@/app/dashboard/types';
import type { ActionLog } from '@/app/dog/[id]/home/types';

const categoryIcons: Record<string, string> = {
  feed: '🍖',
  play: '🎾',
  medicine: '💊',
};

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) {
    return 'Today';
  }
  if (dateOnly.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
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

function groupByDate(logs: ActionLog[]): Record<string, ActionLog[]> {
  const groups: Record<string, ActionLog[]> = {};

  for (const log of logs) {
    const dateKey = new Date(log.timestamp).toLocaleDateString('en-CA');

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
  }

  return groups;
}

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SitterSession | null | 'loading'>(
    'loading'
  );
  const [logs, setLogs] = useState<ActionLog[]>([]);

  useEffect(() => {
    fetch(`/api/sitters/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((body: { data?: SitterSession }) => {
        if (!body.data) {
          setSession(null);
          return;
        }

        setSession(body.data);

        fetch(`/api/actions?petId=${body.data.petId}&all=true`)
          .then((r) => r.json())
          .then((actionsBody: { data?: ActionLog[] }) => {
            const sessionLogs = (actionsBody.data ?? [])
              .filter((l) => l.sessionId === sessionId)
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              );
            setLogs(sessionLogs);
          })
          .catch(() => {});
      })
      .catch(() => setSession(null));
  }, [sessionId]);

  if (session === 'loading') {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />
        <div className="relative z-10 w-8 h-8 opacity-30 animate-pulse">
          <PawIcon color="var(--chewy-blue)" opacity={1} />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-nunito">
        <PageBackground />
        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-4">
          <div className="w-12 h-12 opacity-30">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            Session not found
          </h1>
          <Link
            href="/dashboard"
            className="font-nunito text-sm font-semibold text-chewy-blue hover:text-chewy-blue-dark transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const feedCount = logs.filter((l) => l.category === 'feed').length;
  const playCount = logs.filter((l) => l.category === 'play').length;
  const medCount = logs.filter((l) => l.category === 'medicine').length;
  const photoCount = logs.filter((l) => l.photoUrl).length;

  const grouped = groupByDate(logs);
  const dateKeys = Object.keys(grouped).sort().reverse();

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-24 gap-6 max-w-md mx-auto">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/dashboard"
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Dashboard
          </Link>
          {session.isActive && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-chewy-blue animate-pulse" />
              <span className="font-nunito text-xs font-bold text-chewy-blue uppercase">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Session info card */}
        <div className="animate-fade-up w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark mb-3">
            {formatDateRange(session.startDate, session.endDate)}
          </h1>

          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-text-muted" />
              <span className="font-nunito text-sm text-text-mid">
                {formatDateRange(session.startDate, session.endDate)}
              </span>
            </div>
            {session.dropOffTime && session.pickUpTime && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-text-muted" />
                <span className="font-nunito text-sm text-text-mid">
                  {session.pickUpTime} – {session.dropOffTime}
                </span>
              </div>
            )}
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-chewy-orange/10 font-nunito text-xs font-bold text-chewy-orange">
              🍖 {feedCount} fed
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-chewy-blue/10 font-nunito text-xs font-bold text-chewy-blue">
              🎾 {playCount} play
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-chewy-orange/10 font-nunito text-xs font-bold text-chewy-orange">
              💊 {medCount} meds
            </span>
            {photoCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream font-nunito text-xs font-bold text-text-mid">
                📸 {photoCount} photos
              </span>
            )}
          </div>
        </div>

        {/* Activity by date */}
        {dateKeys.length === 0 ? (
          <div
            className="animate-fade-up w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5"
            style={{ animationDelay: '0.15s' }}
          >
            <p className="font-nunito text-sm text-text-muted/60 text-center py-4">
              No activity logged in this session yet.
            </p>
          </div>
        ) : (
          dateKeys.map((dateKey, index) => {
            const dayLogs = grouped[dateKey];

            return (
              <div
                key={dateKey}
                className="animate-fade-up w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5"
                style={{ animationDelay: `${0.15 + index * 0.1}s` }}
              >
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-nunito text-xs font-bold text-chewy-blue uppercase tracking-widest">
                    {formatDateLabel(dateKey)}
                  </span>
                  <div className="flex-1 h-px bg-black/5" />
                  <span className="font-nunito text-xs text-text-muted">
                    {dayLogs.length}{' '}
                    {dayLogs.length === 1 ? 'action' : 'actions'}
                  </span>
                </div>

                {/* Logs */}
                <div className="flex flex-col gap-3">
                  {dayLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 py-1.5">
                      <span className="text-lg mt-0.5">
                        {categoryIcons[log.category] ?? '📋'}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span className="font-nunito text-sm font-semibold text-text-dark block">
                          {log.itemName}
                        </span>
                        <span className="font-nunito text-xs text-text-muted">
                          {formatTime(log.timestamp)}
                        </span>
                      </div>

                      {log.photoUrl && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5 flex-shrink-0">
                          <Image
                            src={log.photoUrl}
                            alt={`${log.itemName} photo`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav petId={session.petId} />
    </div>
  );
}

import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import type { ActionLog } from '@/app/dog/[id]/home/types';
import type { SitterSession } from '../../types';

interface SitterActivityFeedProps {
  logs: ActionLog[];
  sessions: SitterSession[];
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

function isActiveSession(session: SitterSession): boolean {
  const today = new Date().toLocaleDateString('en-CA');
  return session.startDate <= today && session.endDate >= today;
}

interface SessionSummary {
  feedCount: number;
  playCount: number;
  medCount: number;
  photoCount: number;
  lastAction: string | null;
}

function summarizeLogs(sessionLogs: ActionLog[]): SessionSummary {
  return {
    feedCount: sessionLogs.filter((l) => l.category === 'feed').length,
    playCount: sessionLogs.filter((l) => l.category === 'play').length,
    medCount: sessionLogs.filter((l) => l.category === 'medicine').length,
    photoCount: sessionLogs.filter((l) => l.photoUrl).length,
    lastAction: sessionLogs.length > 0 ? sessionLogs[0].timestamp : null,
  };
}

function formatTimeSince(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);

  if (diffMin < 1) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  if (diffHrs < 24) {
    return `${diffHrs}h ago`;
  }

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function SitterActivityFeed({
  logs,
  sessions,
}: SitterActivityFeedProps) {
  const activeSessions = sessions.filter(isActiveSession);
  const pastSessions = sessions.filter((s) => !isActiveSession(s));

  if (sessions.length === 0) {
    return (
      <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
        <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
          Sitter Activity
        </h3>
        <p className="font-nunito text-sm text-text-muted/60 text-center py-4">
          No sitter sessions yet. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {activeSessions.length > 0 && (
        <div className="bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-chewy-blue animate-pulse" />
            <h3 className="font-nunito text-xs font-bold text-chewy-blue uppercase tracking-widest">
              Active Sessions
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {activeSessions.map((session) => {
              const sessionLogs = logs
                .filter((l) => l.sessionId === session.id)
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                );
              const summary = summarizeLogs(sessionLogs);

              return (
                <SessionRow
                  key={session.id}
                  session={session}
                  summary={summary}
                  totalLogs={sessionLogs.length}
                  isActive
                />
              );
            })}
          </div>
        </div>
      )}

      {pastSessions.length > 0 && (
        <div className="bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
          <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
            Past Sessions
          </h3>

          <div className="flex flex-col gap-3">
            {pastSessions.map((session) => {
              const sessionLogs = logs
                .filter((l) => l.sessionId === session.id)
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                );
              const summary = summarizeLogs(sessionLogs);

              return (
                <SessionRow
                  key={session.id}
                  session={session}
                  summary={summary}
                  totalLogs={sessionLogs.length}
                  isActive={false}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-component ---

interface SessionRowProps {
  session: SitterSession;
  summary: SessionSummary;
  totalLogs: number;
  isActive: boolean;
}

function SessionRow({
  session,
  summary,
  totalLogs,
  isActive,
}: SessionRowProps) {
  const label = formatDateRange(session.startDate, session.endDate);

  return (
    <Link
      href={`/dashboard/session/${session.id}`}
      className={`block rounded-xl p-4 transition-all hover:shadow-sm ${
        isActive
          ? 'bg-chewy-blue/5 border border-chewy-blue/10 hover:bg-chewy-blue/8'
          : 'bg-cream hover:bg-cream/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <span className="font-nunito text-sm font-bold text-text-dark block">
            {label}
          </span>

          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-text-muted" />
              <span className="font-nunito text-xs text-text-muted">
                {formatDateRange(session.startDate, session.endDate)}
              </span>
            </div>
            {session.dropOffTime && session.pickUpTime && (
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-text-muted" />
                <span className="font-nunito text-xs text-text-muted">
                  {session.pickUpTime} – {session.dropOffTime}
                </span>
              </div>
            )}
          </div>
        </div>

        <ChevronRight size={18} className="text-text-muted flex-shrink-0" />
      </div>

      {totalLogs > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {summary.feedCount > 0 && (
            <span className="font-nunito text-[11px] font-bold text-chewy-orange">
              🍖 {summary.feedCount}
            </span>
          )}
          {summary.playCount > 0 && (
            <span className="font-nunito text-[11px] font-bold text-chewy-blue">
              🎾 {summary.playCount}
            </span>
          )}
          {summary.medCount > 0 && (
            <span className="font-nunito text-[11px] font-bold text-chewy-orange">
              💊 {summary.medCount}
            </span>
          )}
          {summary.photoCount > 0 && (
            <span className="font-nunito text-[11px] font-bold text-text-mid">
              📸 {summary.photoCount}
            </span>
          )}
          <span className="font-nunito text-[11px] text-text-muted ml-auto">
            {summary.lastAction ? formatTimeSince(summary.lastAction) : ''}
          </span>
        </div>
      )}

      {totalLogs === 0 && (
        <p className="font-nunito text-[11px] text-text-muted/60 mt-2">
          No activity yet
        </p>
      )}
    </Link>
  );
}

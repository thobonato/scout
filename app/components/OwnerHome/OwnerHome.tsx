'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Dog, ClipboardList, Link2 } from 'lucide-react';
import { PawIcon } from '@/components/PawIcon/PawIcon';
import { PageBackground } from '@/components/PageBackground/PageBackground';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { calculateFulfillment } from '@/lib/fulfillment';
import type { DogProfile } from '@/app/create-dog/types';
import type { ActionLog } from '@/app/dog/[id]/home/types';
import type { SitterSession } from '@/app/dashboard/types';

interface OwnerHomeProps {
  dog: DogProfile;
  petId: string;
}

function isActiveSession(session: SitterSession): boolean {
  const today = new Date().toLocaleDateString('en-CA');
  return session.startDate <= today && session.endDate >= today;
}

export function OwnerHome({ dog, petId }: OwnerHomeProps) {
  const displayUrl = dog.avatarUrl || dog.photoUrl;

  const [todayLogs, setTodayLogs] = useState<ActionLog[]>([]);
  const [sessions, setSessions] = useState<SitterSession[]>([]);

  useEffect(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    fetch(`/api/actions?petId=${petId}`)
      .then((res) => res.json())
      .then((body: { data?: ActionLog[] }) => {
        if (body.data) {
          setTodayLogs(
            body.data.filter((l) => new Date(l.timestamp) >= todayStart)
          );
        }
      })
      .catch(() => {});

    fetch(`/api/sitters/sessions?petId=${petId}`)
      .then((res) => res.json())
      .then((body: { data?: SitterSession[] }) => {
        if (body.data) {
          setSessions(body.data);
        }
      })
      .catch(() => {});
  }, [petId]);

  const fulfillment = calculateFulfillment(todayLogs);
  const activeSessions = sessions.filter(isActiveSession);
  const avgFulfillment = Math.round(
    (fulfillment.hunger + fulfillment.exercise + fulfillment.medicine) / 3
  );

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-10 pb-28 gap-6 max-w-md mx-auto">
        {/* Header */}
        <div className="animate-fade-up w-full flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-chewy-blue/20 bg-cream flex-shrink-0">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt={dog.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 opacity-20">
                  <PawIcon color="var(--chewy-blue)" opacity={1} />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="font-nunito text-sm text-text-muted">
              Good to see you
            </p>
            <h1 className="font-fredoka text-xl font-semibold text-text-dark">
              {dog.name}&apos;s Home
            </h1>
          </div>

          <div className="flex items-center gap-[6px]">
            <div className="animate-wag w-6 h-6">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-fredoka text-sm font-semibold text-chewy-blue">
              scout
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div
          className="animate-fade-up w-full grid grid-cols-3 gap-3"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 text-center">
            <p className="font-fredoka text-2xl font-bold text-chewy-blue">
              {avgFulfillment}%
            </p>
            <p className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Care Today
            </p>
          </div>
          <div className="bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 text-center">
            <p className="font-fredoka text-2xl font-bold text-chewy-orange">
              {todayLogs.length}
            </p>
            <p className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Actions
            </p>
          </div>
          <div className="bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 text-center">
            <p className="font-fredoka text-2xl font-bold text-text-dark">
              {activeSessions.length}
            </p>
            <p className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
              Active Sitters
            </p>
          </div>
        </div>

        {/* Fulfillment bars */}
        <div
          className="animate-fade-up w-full bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5"
          style={{ animationDelay: '0.2s' }}
        >
          <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
            Today&apos;s Care
          </h3>
          <div className="flex flex-col gap-3">
            <MeterRow
              label="Hunger"
              icon="🍖"
              value={fulfillment.hunger}
              color="bg-chewy-orange"
            />
            <MeterRow
              label="Exercise"
              icon="🎾"
              value={fulfillment.exercise}
              color="bg-chewy-blue"
            />
            <MeterRow
              label="Medicine"
              icon="💊"
              value={fulfillment.medicine}
              color="bg-chewy-orange"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="animate-fade-up w-full flex flex-col gap-3"
          style={{ animationDelay: '0.3s' }}
        >
          <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
            Quick Actions
          </h3>

          <QuickAction
            href="/dog/temp"
            icon={Dog}
            label="Pet Home"
            description="Feed, play, give meds"
            color="bg-chewy-blue/10 text-chewy-blue"
          />
          <QuickAction
            href="/dashboard"
            icon={ClipboardList}
            label="Sitter Sessions"
            description={`${sessions.length} session${sessions.length !== 1 ? 's' : ''} · ${activeSessions.length} active`}
            color="bg-chewy-orange/10 text-chewy-orange"
          />
          <QuickAction
            href="/dashboard"
            icon={Link2}
            label="Share with Sitter"
            description="Generate a new sitter link"
            color="bg-chewy-blue/10 text-chewy-blue"
          />
        </div>

        {/* Active sitter sessions */}
        {activeSessions.length > 0 && (
          <div
            className="animate-fade-up w-full bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-chewy-blue animate-pulse" />
              <h3 className="font-nunito text-xs font-bold text-chewy-blue uppercase tracking-widest">
                Active Sitters
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {activeSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/session/${session.id}`}
                  className="flex items-center gap-3 py-2 px-3 bg-chewy-blue/5 rounded-xl hover:bg-chewy-blue/8 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-nunito text-sm font-semibold text-text-dark block capitalize">
                      {session.role === 'full_access'
                        ? 'Full Access'
                        : 'View Only'}
                    </span>
                    <span className="font-nunito text-xs text-text-muted">
                      {session.startDate} – {session.endDate}
                      {session.pickUpTime && session.dropOffTime
                        ? ` · ${session.pickUpTime} – ${session.dropOffTime}`
                        : ''}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {todayLogs.length > 0 && (
          <div
            className="animate-fade-up w-full bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5"
            style={{ animationDelay: '0.5s' }}
          >
            <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Recent Activity
            </h3>
            <div className="flex flex-col gap-2">
              {todayLogs
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .slice(0, 4)
                .map((log) => (
                  <div key={log.id} className="flex items-center gap-3 py-1.5">
                    <span className="text-base">
                      {getCategoryIcon(log.category)}
                    </span>
                    <span className="font-nunito text-sm font-semibold text-text-dark flex-1">
                      {log.itemName}
                    </span>
                    <span className="font-nunito text-xs text-text-muted">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// --- Helpers ---

const CATEGORY_ICONS: Record<string, string> = {
  feed: '🍖',
  play: '🎾',
  medicine: '💊',
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '📋';
}

interface MeterRowProps {
  label: string;
  icon: string;
  value: number;
  color: string;
}

function MeterRow({ label, icon, value, color }: MeterRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 text-center">{icon}</span>
      <span className="font-nunito text-xs font-bold text-text-mid w-16">
        {label}
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-black/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-nunito text-xs font-bold text-text-mid w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  icon: typeof Dog;
  label: string;
  description: string;
  color: string;
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  color,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-warm-white rounded-2xl p-4 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <span className="font-nunito text-sm font-bold text-text-dark block">
          {label}
        </span>
        <span className="font-nunito text-xs text-text-muted">
          {description}
        </span>
      </div>
      <ChevronRight size={18} className="text-text-muted" />
    </Link>
  );
}

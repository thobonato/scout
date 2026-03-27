"use client";

import { useState } from "react";
import { Link2, Copy, Check, Trash2, Plus, Calendar } from "lucide-react";
import {
  loadSitterSessions,
  createSitterSession,
  revokeSitterSession,
} from "@/lib/sitter-sessions";
import type { SitterSession } from "../../types";

interface SitterLinkProps {
  dogId: string;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (start === end) {
    return startDate.toLocaleDateString("en-US", opts);
  }

  return `${startDate.toLocaleDateString("en-US", opts)} – ${endDate.toLocaleDateString("en-US", opts)}`;
}

export function SitterLink({ dogId }: SitterLinkProps) {
  const [sessions, setSessions] = useState<SitterSession[]>(() =>
    loadSitterSessions()
      .filter((s) => s.dogId === dogId)
      .reverse(),
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropOffTime, setDropOffTime] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");

  function resetForm(): void {
    setLabel("");
    setStartDate("");
    setEndDate("");
    setDropOffTime("");
    setPickUpTime("");
    setIsCreating(false);
  }

  function handleCreate(): void {
    if (!label.trim() || !startDate || !endDate) {
      return;
    }

    const session = createSitterSession({
      dogId,
      label: label.trim(),
      startDate,
      endDate,
      dropOffTime,
      pickUpTime,
    });

    setSessions((prev) => [session, ...prev]);
    resetForm();
  }

  async function handleCopy(session: SitterSession): Promise<void> {
    const url = `${window.location.origin}/sitter/${session.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(session.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleRevoke(sessionId: string): void {
    revokeSitterSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }

  const inputClasses =
    "w-full px-3 py-2.5 rounded-xl border border-black/10 bg-cream font-nunito text-sm text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-chewy-blue/30 focus:border-chewy-blue/40 transition-all";

  return (
    <div className="w-full bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
          Sitter Sessions
        </h3>
        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 font-nunito text-xs font-bold text-chewy-blue hover:text-chewy-blue-dark transition-colors"
          >
            <Plus size={14} />
            New Session
          </button>
        )}
      </div>

      {/* Create form */}
      {isCreating && (
        <div className="mb-5 p-4 bg-cream rounded-xl flex flex-col gap-3">
          <input
            type="text"
            placeholder="Sitter name (e.g. Sarah)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClasses}
          />

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Pick-up
              </label>
              <input
                type="time"
                value={pickUpTime}
                onChange={(e) => setPickUpTime(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-nunito text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Drop-off
              </label>
              <input
                type="time"
                value={dropOffTime}
                onChange={(e) => setDropOffTime(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!label.trim() || !startDate || !endDate}
              className="flex-1 py-2.5 rounded-full font-nunito text-sm font-bold bg-chewy-blue hover:bg-chewy-blue-dark text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate Link
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="py-2.5 px-4 rounded-full font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sessions list */}
      {sessions.length === 0 && !isCreating ? (
        <p className="font-nunito text-sm text-text-muted/60 text-center py-4">
          No sitter sessions yet. Create one to share your dog&apos;s routine.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => {
            const isCopied = copiedId === session.id;

            return (
              <div key={session.id} className="py-3 px-4 bg-cream rounded-xl">
                <div className="flex items-center gap-3">
                  <Link2 size={16} className="text-chewy-blue flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <span className="font-nunito text-sm font-semibold text-text-dark block">
                      {session.label}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={11} className="text-text-muted" />
                      <span className="font-nunito text-xs text-text-muted">
                        {formatDateRange(session.startDate, session.endDate)}
                        {session.dropOffTime && session.pickUpTime
                          ? ` · ${session.pickUpTime} – ${session.dropOffTime}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(session)}
                    className="p-2 rounded-lg hover:bg-chewy-blue/10 transition-colors"
                    title="Copy link"
                  >
                    {isCopied ? (
                      <Check size={16} className="text-chewy-blue" />
                    ) : (
                      <Copy size={16} className="text-text-muted" />
                    )}
                  </button>

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
            );
          })}
        </div>
      )}
    </div>
  );
}

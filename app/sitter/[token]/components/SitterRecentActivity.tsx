"use client";

import type { SitterActivityEntry, SitterTaskCategory } from "../types";

interface SitterRecentActivityProps {
  entries: SitterActivityEntry[];
}

const CATEGORY_ICONS: Record<SitterTaskCategory, string> = {
  food: "🍖",
  exercise: "🎾",
  medicine: "💊",
};

export function SitterRecentActivity({ entries }: SitterRecentActivityProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        Recent Activity
      </h3>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div key={entry.taskId} className="flex items-center gap-3 py-1.5">
            <span className="text-base w-6 text-center">
              {CATEGORY_ICONS[entry.category]}
            </span>
            <span className="font-nunito text-sm font-semibold text-text-dark flex-1">
              {entry.label}
            </span>
            <span className="font-nunito text-xs text-text-muted">
              {new Date(entry.completedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

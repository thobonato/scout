"use client";

import type { TierId } from "../types";

interface TierProgressBarProps {
  currentTier: TierId;
  nextTier: TierId | null;
  totalPoints: number;
  pointsToNextTier: number;
}

const TIER_THRESHOLDS: Record<TierId, number> = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3500,
};

const TIER_LABELS: Record<TierId, { name: string; icon: string }> = {
  bronze: { name: "Bronze", icon: "🥉" },
  silver: { name: "Silver", icon: "🥈" },
  gold: { name: "Gold", icon: "🥇" },
  platinum: { name: "Platinum", icon: "💎" },
};

export function TierProgressBar({
  currentTier,
  nextTier,
  totalPoints,
  pointsToNextTier,
}: TierProgressBarProps) {
  if (!nextTier) {
    return (
      <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💎</span>
          <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
            Max Tier Reached
          </h3>
        </div>
        <p className="font-nunito text-sm text-text-mid">
          You&apos;ve reached Platinum! Enjoy the best discounts on Chewy.
        </p>
      </div>
    );
  }

  const currentMin = TIER_THRESHOLDS[currentTier];
  const nextMin = TIER_THRESHOLDS[nextTier];
  const rangeTotal = nextMin - currentMin;
  const progress =
    rangeTotal > 0 ? ((totalPoints - currentMin) / rangeTotal) * 100 : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
        Next Tier
      </h3>

      {/* From / To labels */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-nunito text-xs font-semibold text-text-mid">
          {TIER_LABELS[currentTier].icon} {TIER_LABELS[currentTier].name}
        </span>
        <span className="font-nunito text-xs font-semibold text-chewy-blue">
          {TIER_LABELS[nextTier].icon} {TIER_LABELS[nextTier].name}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-chewy-blue transition-all duration-700"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <p className="font-nunito text-xs text-text-muted mt-2 text-center">
        <span className="font-bold text-chewy-blue">{pointsToNextTier}</span>{" "}
        points to {TIER_LABELS[nextTier].name}
      </p>
    </div>
  );
}

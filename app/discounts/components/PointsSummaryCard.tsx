"use client";

import type { TierId } from "../types";

interface PointsSummaryCardProps {
  availablePoints: number;
  lifetimeEarnings: number;
  currentTier: TierId;
}

const TIER_CONFIG: Record<
  TierId,
  { name: string; icon: string; color: string }
> = {
  bronze: { name: "Bronze", icon: "🥉", color: "text-chewy-orange" },
  silver: { name: "Silver", icon: "🥈", color: "text-text-mid" },
  gold: { name: "Gold", icon: "🥇", color: "text-chewy-orange" },
  platinum: { name: "Platinum", icon: "💎", color: "text-chewy-blue" },
};

export function PointsSummaryCard({
  availablePoints,
  lifetimeEarnings,
  currentTier,
}: PointsSummaryCardProps) {
  const tier = TIER_CONFIG[currentTier];

  return (
    <div className="bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      {/* Tier badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{tier.icon}</span>
          <span className={`font-fredoka text-sm font-semibold ${tier.color}`}>
            {tier.name} Member
          </span>
        </div>
        <span className="font-nunito text-xs font-bold text-chewy-orange bg-chewy-orange/10 px-3 py-1 rounded-full uppercase tracking-widest">
          Chewy Points
        </span>
      </div>

      {/* Points display */}
      <div className="text-center py-4">
        <p className="font-fredoka text-5xl font-bold text-chewy-blue">
          {availablePoints.toLocaleString()}
        </p>
        <p className="font-nunito text-sm text-text-muted mt-1">
          points available
        </p>
      </div>

      {/* Lifetime stat */}
      <div className="flex justify-center pt-2 border-t border-black/5">
        <div className="text-center pt-3">
          <p className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
            Lifetime Earned
          </p>
          <p className="font-fredoka text-lg font-semibold text-text-dark mt-0.5">
            {lifetimeEarnings.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

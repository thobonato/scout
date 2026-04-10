"use client";

import type { PointsEarning, PointsSource } from "../types";

interface EarningHistoryProps {
  earnings: PointsEarning[];
}

const SOURCE_CONFIG: Record<PointsSource, { icon: string; color: string }> = {
  feed: { icon: "🍖", color: "text-chewy-orange" },
  play: { icon: "🎾", color: "text-chewy-blue" },
  medicine: { icon: "💊", color: "text-chewy-orange" },
  streak_bonus: { icon: "🔥", color: "text-chewy-orange" },
  achievement_bonus: { icon: "🏆", color: "text-chewy-blue" },
};

export function EarningHistory({ earnings }: EarningHistoryProps) {
  if (earnings.length === 0) {
    return (
      <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5 text-center">
        <p className="font-nunito text-sm text-text-muted">
          No points earned yet. Start caring for your pet!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        Recent Earnings
      </h3>

      <div className="flex flex-col gap-2">
        {earnings.map((earning) => {
          const config = SOURCE_CONFIG[earning.source];

          return (
            <div key={earning.id} className="flex items-center gap-3 py-1.5">
              <span className="text-base w-6 text-center">{config.icon}</span>
              <span className="font-nunito text-sm font-semibold text-text-dark flex-1">
                {earning.label}
              </span>
              <span
                className={`font-fredoka text-sm font-semibold ${config.color}`}
              >
                +{earning.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

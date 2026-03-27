import type { StreakState } from "../../types";

interface StreakBadgeProps {
  streak: StreakState;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak.currentStreak < 1) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-nunito text-sm font-bold text-chewy-orange">
      <span className="text-base">🔥</span>
      {streak.currentStreak}-day streak!
    </span>
  );
}

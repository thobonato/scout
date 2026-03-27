import type { MoodState } from "../../types";

interface MoodBadgeProps {
  mood: MoodState;
}

export function MoodBadge({ mood }: MoodBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-cream px-4 py-1.5 rounded-full font-nunito text-sm font-semibold text-text-mid">
      <span className="text-base">{mood.emoji}</span>
      {mood.label}
    </span>
  );
}

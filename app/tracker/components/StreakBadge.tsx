import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  className?: string;
}

function getStreakDisplay(count: number): { icon: string; colorClass: string } {
  if (count >= 14) {return { icon: "🔥", colorClass: "text-orange-500" };}
  if (count >= 7) {return { icon: "⚡", colorClass: "text-yellow-500" };}
  if (count >= 1) {return { icon: "✨", colorClass: "text-chewy-blue" };}
  return { icon: "💤", colorClass: "text-gray-400" };
}

export function StreakBadge({ count, className }: StreakBadgeProps) {
  const { icon, colorClass } = getStreakDisplay(count);
  const label = count === 1 ? "1 day" : `${count} days`;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <span className="text-sm leading-none" aria-hidden="true">
        {icon}
      </span>
      <span
        className={cn(
          "font-fredoka text-sm font-semibold leading-none",
          colorClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

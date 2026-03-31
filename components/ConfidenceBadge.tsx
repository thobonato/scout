import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  score: number; // 0–100
  className?: string;
}

function getConfidenceTier(score: number): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  if (score >= 85) {
    return {
      label: "Great match",
      colorClass: "text-green-700",
      bgClass: "bg-green-100",
    };
  }
  if (score >= 65) {
    return {
      label: "Good match",
      colorClass: "text-yellow-700",
      bgClass: "bg-yellow-100",
    };
  }
  return {
    label: "Possible match",
    colorClass: "text-orange-700",
    bgClass: "bg-orange-100",
  };
}

export function ConfidenceBadge({ score, className }: ConfidenceBadgeProps) {
  const { label, colorClass, bgClass } = getConfidenceTier(score);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-nunito text-xs font-semibold",
        colorClass,
        bgClass,
        className,
      )}
      title={`${score}% confidence`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label} · {score}%
    </span>
  );
}

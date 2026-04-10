"use client";

interface SitterProgressBarProps {
  completed: number;
  total: number;
}

export function SitterProgressBar({
  completed,
  total,
}: SitterProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllDone = completed === total && total > 0;

  return (
    <div className="w-full bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-nunito text-sm font-semibold text-text-dark">
          {completed} of {total} tasks done
        </span>
        {isAllDone && (
          <span className="font-fredoka text-sm font-semibold text-chewy-blue">
            All done!
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-chewy-blue transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="font-nunito text-xs text-text-muted mt-2 text-right">
        {percentage}% complete
      </p>
    </div>
  );
}

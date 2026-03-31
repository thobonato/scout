interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({
  percentage,
  size = 96,
  strokeWidth = 9,
  label,
}: ProgressRingProps) {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center gap-1"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute inset-0"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-100"
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="stroke-chewy-blue transition-[stroke-dashoffset] duration-700 ease-in-out"
        />
      </svg>

      <div className="flex flex-col items-center leading-none">
        <span className="font-fredoka text-xl font-semibold text-chewy-dark">
          {Math.round(clamped)}%
        </span>
        {label && (
          <span className="font-nunito text-[10px] text-gray-400 mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

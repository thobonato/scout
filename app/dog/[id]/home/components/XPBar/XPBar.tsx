import type { XPState } from '@/types/views';

interface XPBarProps {
  xp: XPState;
}

export function XPBar({ xp }: XPBarProps) {
  const percentage = Math.round((xp.xpInCurrentLevel / xp.xpToNextLevel) * 100);

  return (
    <div className="w-full max-w-md bg-warm-white rounded-2xl p-5 shadow-sm border border-black/5">
      <div className="flex items-center gap-4">
        {/* Level badge */}
        <div className="w-11 h-11 rounded-full bg-chewy-orange flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="font-fredoka text-base font-bold text-white">
            {xp.level}
          </span>
        </div>

        {/* XP bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
              Sitter XP
            </span>
            <span className="font-nunito text-xs font-bold text-text-mid">
              {xp.xpInCurrentLevel} / {xp.xpToNextLevel}
            </span>
          </div>

          <div className="h-3 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-chewy-orange transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

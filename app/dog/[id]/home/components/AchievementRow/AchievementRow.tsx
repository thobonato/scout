import type { Achievement } from "../../types";

interface AchievementRowProps {
  achievements: Achievement[];
}

export function AchievementRow({ achievements }: AchievementRowProps) {
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="w-full max-w-md bg-warm-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
          Achievements
        </h3>
        <span className="font-nunito text-xs font-semibold text-text-muted">
          {unlockedCount} / {achievements.length}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {achievements.map((achievement) => {
          const isUnlocked = Boolean(achievement.unlockedAt);

          return (
            <div
              key={achievement.id}
              title={`${achievement.name}: ${achievement.description}`}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                isUnlocked
                  ? "bg-cream shadow-sm"
                  : "bg-black/5 opacity-30 grayscale"
              }`}
            >
              {achievement.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}

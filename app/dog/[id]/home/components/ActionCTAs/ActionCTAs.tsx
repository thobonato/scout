import type { ActionCategory } from '@/types/views';
import { Dog, Pill, Utensils } from 'lucide-react';

interface ActionCTAsProps {
  onAction: (category: ActionCategory) => void;
  lastActionTimes: Record<ActionCategory, string | null>;
}

const actions = [
  {
    category: 'feed' as ActionCategory,
    label: 'Feed',
    icon: Utensils,
    colorClasses: 'bg-chewy-orange hover:bg-chewy-orange-dark',
  },
  {
    category: 'play' as ActionCategory,
    label: 'Play',
    icon: Dog,
    colorClasses: 'bg-chewy-blue hover:bg-chewy-blue-dark',
  },
  {
    category: 'medicine' as ActionCategory,
    label: 'Meds',
    icon: Pill,
    colorClasses: 'bg-chewy-orange hover:bg-chewy-orange-dark',
  },
];

function formatTimeSince(timestamp: string | null): {
  text: string;
  colorClass: string;
} {
  if (!timestamp) {
    return { text: 'Not yet', colorClass: 'text-chewy-orange' };
  }

  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 60) {
    return { text: `${diffMinutes}m ago`, colorClass: 'text-white/80' };
  }

  if (diffHours < 3) {
    return { text: `${diffHours}h ago`, colorClass: 'text-white/80' };
  }

  return { text: `${diffHours}h ago`, colorClass: 'text-white/60' };
}

export function ActionCTAs({ onAction, lastActionTimes }: ActionCTAsProps) {
  return (
    <div className="flex gap-4 w-full max-w-xs justify-center">
      {actions.map((action) => {
        const Icon = action.icon;
        const timeSince = formatTimeSince(lastActionTimes[action.category]);

        return (
          <button
            key={action.category}
            type="button"
            onClick={() => onAction(action.category)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-4 px-3 rounded-full text-white font-nunito font-bold shadow-sm transition-all hover:scale-105 ${action.colorClasses}`}
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-sm">{action.label}</span>
            <span
              className={`text-[10px] font-semibold ${timeSince.colorClass}`}
            >
              {timeSince.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}

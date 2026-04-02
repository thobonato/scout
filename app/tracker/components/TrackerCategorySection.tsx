'use client';

import { cn } from '@/lib/utils';
import type { TrackerCategory, TrackerTask } from '@/types/views';
import { ProgressRing } from './ProgressRing';
import { StreakBadge } from './StreakBadge';
import { TrackerTaskItem } from './TrackerTaskItem';

interface TrackerCategorySectionProps {
  category: TrackerCategory;
  tasks: TrackerTask[];
  streak: number;
  onToggle: (id: string) => void;
}

const CATEGORY_META: Record<
  TrackerCategory,
  { label: string; icon: string; accentClass: string; bgClass: string }
> = {
  food: {
    label: 'Food',
    icon: '🍖',
    accentClass: 'text-chewy-orange',
    bgClass: 'bg-orange-50',
  },
  exercise: {
    label: 'Exercise',
    icon: '🏃',
    accentClass: 'text-green-600',
    bgClass: 'bg-green-50',
  },
  medicine: {
    label: 'Medicine',
    icon: '💊',
    accentClass: 'text-chewy-blue',
    bgClass: 'bg-blue-50',
  },
};

export function TrackerCategorySection({
  category,
  tasks,
  streak,
  onToggle,
}: TrackerCategorySectionProps) {
  if (tasks.length === 0) {
    return null;
  }

  const meta = CATEGORY_META[category];
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <section className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none" aria-hidden="true">
            {meta.icon}
          </span>
          <h2
            className={cn(
              'font-fredoka text-lg font-semibold',
              meta.accentClass
            )}
          >
            {meta.label}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <StreakBadge count={streak} />
          <ProgressRing percentage={percentage} size={52} strokeWidth={6} />
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TrackerTaskItem key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}

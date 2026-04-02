'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { TrackerCategory, TrackerTask } from '@/types/views';

interface TrackerTaskItemProps {
  task: TrackerTask;
  onToggle: (id: string) => void;
}

const CATEGORY_BG: Record<TrackerCategory, string> = {
  food: 'bg-orange-50 border-orange-100',
  exercise: 'bg-green-50 border-green-100',
  medicine: 'bg-blue-50 border-blue-100',
};

const CATEGORY_TIME_COLOR: Record<TrackerCategory, string> = {
  food: 'text-chewy-orange',
  exercise: 'text-green-600',
  medicine: 'text-chewy-blue',
};

export function TrackerTaskItem({ task, onToggle }: TrackerTaskItemProps) {
  const checkboxId = `task-${task.id}`;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200',
        CATEGORY_BG[task.category],
        task.isCompleted && 'opacity-50'
      )}
    >
      <Checkbox
        id={checkboxId}
        checked={task.isCompleted}
        onCheckedChange={() => onToggle(task.id)}
        className="data-[state=checked]:bg-chewy-blue data-[state=checked]:border-chewy-blue border-gray-300"
      />

      <label
        htmlFor={checkboxId}
        className={cn(
          'flex-1 cursor-pointer font-nunito text-sm font-medium text-chewy-dark transition-all duration-200 select-none',
          task.isCompleted && 'line-through text-gray-400'
        )}
      >
        {task.label}
        {task.note && (
          <span className="block font-nunito text-xs text-gray-400 font-normal mt-0.5 no-underline">
            {task.note}
          </span>
        )}
      </label>

      {task.time && (
        <span
          className={cn(
            'font-nunito text-xs font-semibold tabular-nums',
            CATEGORY_TIME_COLOR[task.category]
          )}
        >
          {task.time}
        </span>
      )}
    </div>
  );
}

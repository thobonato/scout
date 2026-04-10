"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SitterTask, SitterTaskCategory } from "../types";

interface SitterTaskItemProps {
  task: SitterTask;
  onToggle: (id: string) => void;
}

const CATEGORY_STYLE: Record<
  SitterTaskCategory,
  { bg: string; accent: string; icon: string }
> = {
  food: {
    bg: "bg-orange-50 border-orange-100",
    accent: "text-chewy-orange",
    icon: "🍖",
  },
  exercise: {
    bg: "bg-green-50 border-green-100",
    accent: "text-green-600",
    icon: "🎾",
  },
  medicine: {
    bg: "bg-blue-50 border-blue-100",
    accent: "text-chewy-blue",
    icon: "💊",
  },
};

export function SitterTaskItem({ task, onToggle }: SitterTaskItemProps) {
  const style = CATEGORY_STYLE[task.category];

  return (
    <button
      type="button"
      onClick={() => onToggle(task.id)}
      className={cn(
        "flex items-center gap-3 w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
        style.bg,
        task.isCompleted && "opacity-60",
      )}
    >
      {/* Check circle */}
      <div
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          task.isCompleted
            ? "bg-green-500 border-green-500"
            : "border-gray-300 bg-white",
        )}
      >
        {task.isCompleted && (
          <Check size={14} className="text-white" strokeWidth={3} />
        )}
      </div>

      {/* Category icon */}
      <span className="text-lg flex-shrink-0">{style.icon}</span>

      {/* Label + note */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "font-nunito text-sm font-semibold text-text-dark block transition-all duration-200",
            task.isCompleted && "line-through text-text-muted",
          )}
        >
          {task.label}
        </span>
        {task.note && (
          <span className="font-nunito text-xs text-text-muted font-normal mt-0.5 block">
            {task.note}
          </span>
        )}
      </div>

      {/* Time badge */}
      {task.time && (
        <span
          className={cn(
            "font-nunito text-xs font-semibold tabular-nums flex-shrink-0",
            style.accent,
          )}
        >
          {task.time}
        </span>
      )}
    </button>
  );
}

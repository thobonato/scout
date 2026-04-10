"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PawIcon } from "@/components/PawIcon/PawIcon";
import { PageBackground } from "@/components/PageBackground/PageBackground";
import { SitterProgressBar } from "../components/SitterProgressBar";
import { SitterTaskItem } from "../components/SitterTaskItem";
import { SitterDaySelector } from "../components/SitterDaySelector";
import { MOCK_ROUTINE } from "../mock-data";
import type {
  SitterRoutineData,
  SitterTask,
  SitterTaskCategory,
} from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CATEGORY_ORDER: SitterTaskCategory[] = ["food", "exercise", "medicine"];

const CATEGORY_LABELS: Record<SitterTaskCategory, string> = {
  food: "Feeding",
  exercise: "Exercise",
  medicine: "Medicine",
};

function groupByCategory(
  tasks: SitterTask[],
): Record<SitterTaskCategory, SitterTask[]> {
  const groups: Record<SitterTaskCategory, SitterTask[]> = {
    food: [],
    exercise: [],
    medicine: [],
  };

  for (const task of tasks) {
    groups[task.category].push(task);
  }

  return groups;
}

function getTodayOrFirstDate(days: SitterRoutineData["days"]): string {
  const today = new Date().toISOString().slice(0, 10);
  const match = days.find((d) => d.date === today);

  return match ? today : (days[0]?.date ?? today);
}

// ---------------------------------------------------------------------------
// Page — sitter routine (day-wise task checklist)
// ---------------------------------------------------------------------------
export default function SitterRoutinePage() {
  const params = useParams();
  const token = params.token as string;

  // TODO: replace with fetch(`/api/sitter/${token}/routine`) when BE is ready
  const [data, setData] = useState<SitterRoutineData>({
    ...MOCK_ROUTINE,
    token,
  });

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    getTodayOrFirstDate(data.days),
  );

  const selectedDay = data.days.find((d) => d.date === selectedDate);
  const tasks = selectedDay?.tasks ?? [];
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const grouped = groupByCategory(tasks);

  function handleToggle(taskId: string) {
    // TODO: POST /api/sitter/:token/tasks/:taskId/toggle
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.date === selectedDate
          ? {
              ...day,
              tasks: day.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      isCompleted: !t.isCompleted,
                      completedAt: !t.isCompleted
                        ? new Date().toISOString()
                        : undefined,
                    }
                  : t,
              ),
            }
          : day,
      ),
    }));
  }

  return (
    <div className="bg-page min-h-screen relative overflow-hidden flex flex-col items-center font-nunito">
      <PageBackground />

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-8 pb-12 gap-5 max-w-md mx-auto">
        {/* Header */}
        <div className="animate-fade-up w-full flex items-center justify-between">
          <Link
            href={`/sitter/${token}`}
            className="font-nunito text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Back
          </Link>
          <div className="flex items-center gap-[6px]">
            <div className="w-5 h-5">
              <PawIcon color="var(--chewy-blue)" opacity={1} />
            </div>
            <span className="font-fredoka text-sm font-semibold text-chewy-blue">
              scout
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.05s" }}
        >
          <h1 className="font-fredoka text-2xl font-semibold text-text-dark">
            {data.petName}&apos;s Routine
          </h1>
          <p className="font-nunito text-sm text-text-muted mt-0.5">
            {data.sessionLabel}
          </p>
        </div>

        {/* Day selector */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.1s" }}
        >
          <SitterDaySelector
            days={data.days}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        {/* Day progress */}
        <div
          className="animate-fade-up w-full"
          style={{ animationDelay: "0.15s" }}
        >
          <SitterProgressBar completed={completedCount} total={tasks.length} />
        </div>

        {/* Task list grouped by category */}
        {CATEGORY_ORDER.map((category, catIdx) => {
          const catTasks = grouped[category];
          if (catTasks.length === 0) {
            return null;
          }

          const catCompleted = catTasks.filter((t) => t.isCompleted).length;

          return (
            <div
              key={category}
              className="animate-fade-up w-full"
              style={{ animationDelay: `${0.2 + catIdx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-nunito text-xs font-bold text-text-muted uppercase tracking-widest">
                  {CATEGORY_LABELS[category]}
                </h3>
                <span className="font-nunito text-xs text-text-muted">
                  {catCompleted}/{catTasks.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {catTasks.map((task) => (
                  <SitterTaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

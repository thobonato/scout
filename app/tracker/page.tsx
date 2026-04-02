'use client';

import type { DailyTrackerData, TrackerCategory } from '@/types/views';
import { useState } from 'react';
import { ProgressRing } from './components/ProgressRing';
import { TrackerCategorySection } from './components/TrackerCategorySection';

// ---------------------------------------------------------------------------
// Mock data — swap this fetch with GET /api/tracker when the route is ready
// ---------------------------------------------------------------------------
const MOCK_DATA: DailyTrackerData = {
  date: new Date().toISOString(),
  petName: 'Biscuit',
  tasks: [
    {
      id: 'f1',
      category: 'food',
      label: 'Morning kibble (1 cup)',
      time: '7:00 AM',
      isCompleted: false,
    },
    {
      id: 'f2',
      category: 'food',
      label: 'Evening kibble (1 cup)',
      time: '6:00 PM',
      isCompleted: false,
    },
    {
      id: 'f3',
      category: 'food',
      label: 'Fresh water refill',
      isCompleted: true,
    },
    {
      id: 'e1',
      category: 'exercise',
      label: 'Morning walk (30 min)',
      time: '8:00 AM',
      isCompleted: false,
    },
    {
      id: 'e2',
      category: 'exercise',
      label: 'Backyard play session',
      time: '4:00 PM',
      isCompleted: false,
    },
    {
      id: 'm1',
      category: 'medicine',
      label: 'Flea & tick tablet',
      note: 'Give with food',
      time: '7:00 AM',
      isCompleted: false,
    },
    {
      id: 'm2',
      category: 'medicine',
      label: 'Joint supplement (2 chews)',
      isCompleted: true,
    },
  ],
  streaks: { food: 5, exercise: 12, medicine: 3 },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function TrackerPage() {
  const [data, setData] = useState<DailyTrackerData>(MOCK_DATA);

  const today = new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const completedTotal = data.tasks.filter((t) => t.isCompleted).length;
  const overallPercentage = Math.round(
    (completedTotal / data.tasks.length) * 100
  );

  const categories: TrackerCategory[] = ['food', 'exercise', 'medicine'];

  function handleToggle(id: string) {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  }

  function getTasksByCategory(category: TrackerCategory) {
    return data.tasks.filter((t) => t.category === category);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-nunito text-sm text-gray-400">{today}</p>
            <h1 className="font-fredoka text-3xl font-semibold text-chewy-dark">
              {data.petName}&apos;s Day
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing
              percentage={overallPercentage}
              size={80}
              label="done"
            />
          </div>
        </div>

        {/* Summary pill */}
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm">
          <span className="font-nunito text-sm text-gray-500">
            {completedTotal} of {data.tasks.length} tasks completed today
          </span>
          {completedTotal === data.tasks.length && (
            <span className="font-fredoka text-sm text-chewy-blue font-semibold">
              🎉 All done!
            </span>
          )}
        </div>

        {/* Category sections */}
        <div className="space-y-8 rounded-3xl bg-white p-5 shadow-sm">
          {categories.map((category, index) => (
            <div key={category}>
              <TrackerCategorySection
                category={category}
                tasks={getTasksByCategory(category)}
                streak={data.streaks[category]}
                onToggle={handleToggle}
              />
              {index < categories.length - 1 && (
                <hr className="mt-6 border-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

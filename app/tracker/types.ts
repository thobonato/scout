export type TrackerCategory = "food" | "exercise" | "medicine";

export interface TrackerTask {
  id: string;
  category: TrackerCategory;
  label: string;
  isCompleted: boolean;
  time?: string;
  note?: string;
}

export interface CategoryStreak {
  category: TrackerCategory;
  currentStreak: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface DailyTrackerData {
  date: string;
  petName: string;
  tasks: TrackerTask[];
  streaks: Record<TrackerCategory, number>;
}

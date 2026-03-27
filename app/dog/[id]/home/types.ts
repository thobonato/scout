export type ActionCategory = "feed" | "play" | "medicine";

export interface CareItem {
  id: string;
  category: ActionCategory;
  name: string;
  icon: string;
}

export interface ActionLog {
  id: string;
  category: ActionCategory;
  itemName: string;
  timestamp: string;
  photoUrl?: string;
  sessionId?: string;
}

export interface FulfillmentState {
  hunger: number;
  exercise: number;
  medicine: number;
}

// Mood system
export type DogMood = "happy" | "hungry" | "playful" | "sleepy";

export interface MoodState {
  mood: DogMood;
  emoji: string;
  label: string;
  borderClass: string;
}

// XP + Level system
export interface XPState {
  totalXP: number;
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
}

// Streak system
export interface StreakState {
  currentStreak: number;
  lastPerfectDate: string | null;
}

// Achievement system
export type AchievementId =
  | "first_feed"
  | "first_play"
  | "first_meds"
  | "streak_3"
  | "streak_7"
  | "streak_30"
  | "photo_pro"
  | "night_owl"
  | "early_bird"
  | "perfect_day"
  | "level_5"
  | "level_10";

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

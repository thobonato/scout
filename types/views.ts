/**
 * Frontend/Views Types
 *
 * Types used by UI components, pages, and client-side logic.
 * Not used by API routes directly.
 */

// ============================================================================
// PET HOME PAGE TYPES
// ============================================================================

export type ActionCategory = 'feed' | 'play' | 'medicine';

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

// ============================================================================
// PET PROFILE CREATION TYPES
// ============================================================================

export type DogGender = 'male' | 'female' | 'unknown';
export type DogSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface DogProfile {
  name: string;
  breed: string;
  age: string;
  photoUrl: string;
  weight?: string;
  gender?: DogGender;
  coatColor?: string;
  size?: DogSize;
  personality?: string;
  medicalNotes?: string;
  isSpayedNeutered?: boolean;
  avatarUrl?: string;
}

// ============================================================================
// GAMIFICATION TYPES
// ============================================================================

// Fulfillment system (care needs met)
export interface FulfillmentState {
  hunger: number;
  exercise: number;
  medicine: number;
}

// Mood system
export type DogMood = 'happy' | 'hungry' | 'playful' | 'sleepy';

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

// Streak system (display)
export interface StreakState {
  currentStreak: number;
  lastPerfectDate: string | null;
}

// Achievement system
export type AchievementId =
  | 'first_feed'
  | 'first_play'
  | 'first_meds'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'photo_pro'
  | 'night_owl'
  | 'early_bird'
  | 'perfect_day'
  | 'level_5'
  | 'level_10';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// ============================================================================
// TRACKER PAGE TYPES
// ============================================================================

export type TrackerCategory = 'food' | 'exercise' | 'medicine';

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

// ============================================================================
// SETTINGS PAGE TYPES
// ============================================================================

export type SitterRole = 'full_access' | 'view_only';

export interface SitterInvitePayload {
  email: string;
  role: SitterRole;
  petId: string;
}

export interface NotificationSettings {
  dailyReminders: boolean;
  missedTaskAlerts: boolean;
  sitterUpdates: boolean;
  weeklyDigest: boolean;
}

export interface SettingsFormValues {
  ownerName: string;
  email: string;
  notifications: NotificationSettings;
}

// ============================================================================
// HEALTH INSIGHTS TYPES
// ============================================================================

export interface HealthInsight {
  category: 'nutrition' | 'exercise' | 'behavior' | 'general';
  title: string;
  insight: string;
  recommendation?: string;
  confidence: number;
}

// ============================================================================
// SITTER SESSION TYPES (View)
// ============================================================================

export interface SitterSession {
  id: string;
  token: string;
  dogId: string;
  createdAt: string;
  label: string;
  startDate: string;
  endDate: string;
  dropOffTime: string;
  pickUpTime: string;
}

/**
 * @fileoverview Defines complete data models mapping to the Supabase database schema.
 * All tables use UUIDs for IDs and timestamps in ISO 8601 format.
 */

// ============================================================================
// USER & PROFILE
// ============================================================================

export interface UserProfile {
  readonly id: string; // Maps to Supabase auth.users.id
  role: 'owner' | 'sitter';
  display_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  readonly id: string;
  user_id: string; // FK → profiles.id
  notifications: {
    dailyReminders: boolean;
    missedTaskAlerts: boolean;
    sitterUpdates: boolean;
    weeklyDigest: boolean;
  };
  theme?: 'light' | 'dark';
  language?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PET & BASIC INFO
// ============================================================================

export interface Pet {
  readonly id: string;
  owner_id: string; // FK → profiles.id
  name: string;
  species: string; // e.g., 'dog', 'cat'
  breed?: string;
  date_of_birth?: string; // ISO date
  gender?: 'male' | 'female' | 'unknown';
  weight?: number; // in lbs
  coat_color?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  personality?: string;
  medical_notes?: string;
  is_spayed_neutered?: boolean;
  avatar_url?: string; // Generated via fal.ai/Gemini
  health_context?: string; // Used for LLM health insights
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DAILY LOGS & ACTIONS
// ============================================================================

export type ActivityType = 'feeding' | 'walk' | 'medication' | 'play';

export interface DailyLog {
  readonly id: string;
  pet_id: string; // FK → pets.id
  logger_id: string; // FK → profiles.id (owner or sitter who logged)
  activity_type: ActivityType;
  notes?: string;
  photo_url?: string; // Photo evidence of the activity
  logged_at: string; // ISO timestamp of when activity happened
  created_at: string; // When record was created
  updated_at: string;
}

// ============================================================================
// DAILY TRACKER
// ============================================================================

export type TrackerCategory = 'food' | 'exercise' | 'medicine';

export interface DailyTask {
  readonly id: string;
  pet_id: string; // FK → pets.id
  owner_id: string; // FK → profiles.id (who created this task)
  category: TrackerCategory;
  label: string; // e.g., "Morning kibble (1 cup)"
  time?: string; // e.g., "7:00 AM"
  note?: string; // e.g., "Give with food"
  is_completed: boolean;
  completed_at?: string; // When it was marked done
  date: string; // ISO date (YYYY-MM-DD) for grouping by day
  created_at: string;
  updated_at: string;
}

export interface Streak {
  readonly id: string;
  pet_id: string; // FK → pets.id
  category: TrackerCategory;
  current_streak: number; // Days in a row
  last_completed_date: string | null; // Last date all tasks in category were done
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SITTER MANAGEMENT
// ============================================================================

export interface SitterInvite {
  readonly id: string;
  owner_id: string; // FK → profiles.id
  pet_id: string; // FK → pets.id (which pet they're invited to care for)
  email: string;
  role: 'full_access' | 'view_only'; // Permissions level
  token: string; // Unique, secret token for accepting invite
  permissions_scope: string[]; // e.g., ['read:pet', 'write:log', 'read:logs']
  expires_at: string; // When invite expires
  accepted_at?: string; // If they accepted
  accepted_by?: string; // FK → profiles.id (the sitter who accepted)
  created_at: string;
  updated_at: string;
}

export interface SitterSession {
  readonly id: string;
  pet_id: string; // FK → pets.id
  sitter_id: string; // FK → profiles.id
  owner_id: string; // FK → profiles.id (who hired them)
  invite_id?: string; // FK → sitter_invites.id (optional, if via invite)
  started_at: string; // When sitter started caring for pet
  ended_at?: string; // When sitter session ended
  notes?: string; // Summary of what happened
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INVENTORY & SUPPLIES
// ============================================================================

export type InventoryType = 'toy' | 'medicine' | 'food';

export interface InventoryItem {
  readonly id: string;
  pet_id: string; // FK → pets.id
  item_type: InventoryType;
  name: string;
  quantity: number;
  unit?: string; // e.g., 'lbs', 'tablets', 'count'
  notes?: string;
  last_restocked_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// RECOMMENDATIONS (AI-generated product suggestions)
// ============================================================================

export interface ProductRecommendation {
  readonly id: string;
  pet_id: string; // FK → pets.id
  external_product_id: string; // From Chewy or other API
  name: string;
  brand: string;
  image_url: string;
  chewy_url: string;
  price: number;
  original_price?: number;
  confidence_score: number; // 0-100: how relevant to pet
  reason_snippet: string; // Why it's recommended
  generated_at: string;
  expires_at: string; // Cache expiry (recommend refresh after this)
  created_at: string;
}

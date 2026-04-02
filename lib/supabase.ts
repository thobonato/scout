import type {
  DailyLog,
  DailyTask,
  InventoryItem,
  Pet,
  ProductRecommendation,
  SitterInvite,
  SitterSession,
  Streak,
  UserProfile,
  UserSettings,
} from '@/lib/types/database';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  );
}

/**
 * Supabase client for frontend (uses anon key, RLS enforced).
 * For server-side code that needs to bypass RLS, use a separate service role client.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// TYPE HELPERS
// ============================================================================

export type Database = {
  public: {
    Tables: {
      profiles: { Row: UserProfile };
      user_settings: { Row: UserSettings };
      pets: { Row: Pet };
      daily_logs: { Row: DailyLog };
      daily_tasks: { Row: DailyTask };
      streaks: { Row: Streak };
      sitter_invites: { Row: SitterInvite };
      sitter_sessions: { Row: SitterSession };
      inventory: { Row: InventoryItem };
      product_recommendations: { Row: ProductRecommendation };
    };
  };
};

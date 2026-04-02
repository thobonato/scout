-- ============================================================================
-- SCOUT DATABASE SCHEMA
-- Run this migration in Supabase SQL editor to set up all tables
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (if re-running migration)
-- ============================================================================
-- Disable RLS temporarily to allow drops
ALTER TABLE IF EXISTS product_recommendations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sitter_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sitter_invites DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS product_recommendations CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS sitter_sessions CASCADE;
DROP TABLE IF EXISTS sitter_invites CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS daily_logs CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'sitter')) DEFAULT 'owner',
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================================
-- 2. USER SETTINGS
-- ============================================================================
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  notifications JSONB NOT NULL DEFAULT '{
    "dailyReminders": true,
    "missedTaskAlerts": true,
    "sitterUpdates": true,
    "weeklyDigest": false
  }'::jsonb,
  theme TEXT CHECK (theme IN ('light', 'dark')),
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================================================
-- 3. PETS
-- ============================================================================
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  weight DECIMAL(8, 2), -- in lbs
  coat_color TEXT,
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'extra-large')),
  personality TEXT,
  medical_notes TEXT,
  is_spayed_neutered BOOLEAN,
  avatar_url TEXT, -- Generated via fal.ai or similar
  health_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_name ON pets(name);

-- ============================================================================
-- 4. DAILY LOGS (activity records)
-- ============================================================================
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  logger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('feeding', 'walk', 'medication', 'play')),
  notes TEXT,
  photo_url TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL, -- When activity actually happened
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_logs_pet_id ON daily_logs(pet_id);
CREATE INDEX idx_daily_logs_logger_id ON daily_logs(logger_id);
CREATE INDEX idx_daily_logs_logged_at ON daily_logs(logged_at);
CREATE INDEX idx_daily_logs_activity_type ON daily_logs(activity_type);
CREATE INDEX idx_daily_logs_pet_logged ON daily_logs(pet_id, logged_at);

-- ============================================================================
-- 5. DAILY TASKS (tracker - recurring tasks for each day)
-- ============================================================================
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('food', 'exercise', 'medicine')),
  label TEXT NOT NULL,
  time TEXT, -- e.g., "7:00 AM"
  note TEXT, -- e.g., "Give with food"
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL, -- ISO date for grouping (YYYY-MM-DD)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_tasks_pet_date ON daily_tasks(pet_id, date);
CREATE INDEX idx_daily_tasks_category ON daily_tasks(category);
CREATE INDEX idx_daily_tasks_is_completed ON daily_tasks(is_completed);

-- ============================================================================
-- 6. STREAKS (track consecutive perfect days per category)
-- ============================================================================
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('food', 'exercise', 'medicine')),
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE, -- Last day all tasks were completed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(pet_id, category)
);

CREATE INDEX idx_streaks_pet_category ON streaks(pet_id, category);

-- ============================================================================
-- 7. SITTER INVITES
-- ============================================================================
CREATE TABLE sitter_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('full_access', 'view_only')) DEFAULT 'view_only',
  token TEXT NOT NULL UNIQUE,
  permissions_scope TEXT[] NOT NULL DEFAULT ARRAY['read:pet', 'read:logs'],
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sitter_invites_owner_id ON sitter_invites(owner_id);
CREATE INDEX idx_sitter_invites_pet_id ON sitter_invites(pet_id);
CREATE INDEX idx_sitter_invites_email ON sitter_invites(email);
CREATE INDEX idx_sitter_invites_token ON sitter_invites(token);
CREATE INDEX idx_sitter_invites_expires_at ON sitter_invites(expires_at);

-- ============================================================================
-- 8. SITTER SESSIONS (active sitter caregiving sessions)
-- ============================================================================
CREATE TABLE sitter_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  sitter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES sitter_invites(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sitter_sessions_pet_id ON sitter_sessions(pet_id);
CREATE INDEX idx_sitter_sessions_sitter_id ON sitter_sessions(sitter_id);
CREATE INDEX idx_sitter_sessions_owner_id ON sitter_sessions(owner_id);
CREATE INDEX idx_sitter_sessions_dates ON sitter_sessions(started_at, ended_at);

-- ============================================================================
-- 9. INVENTORY (supplies for pet)
-- ============================================================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('toy', 'medicine', 'food')),
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT, -- e.g., 'lbs', 'tablets', 'count'
  notes TEXT,
  last_restocked_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_pet_id ON inventory(pet_id);
CREATE INDEX idx_inventory_item_type ON inventory(item_type);

-- ============================================================================
-- 10. PRODUCT RECOMMENDATIONS (AI-generated suggestions)
-- ============================================================================
CREATE TABLE product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  external_product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT,
  chewy_url TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  confidence_score NUMERIC(3, 1) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  reason_snippet TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Cache expiry
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_recommendations_pet_id ON product_recommendations(pet_id);
CREATE INDEX idx_product_recommendations_expires_at ON product_recommendations(expires_at);
CREATE INDEX idx_product_recommendations_external_id ON product_recommendations(external_product_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Profiles: Users can read their own profile + view sitters they hired
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_self_read ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Pets: Owners can manage their pets; sitters can view if invited
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY pets_owner_all ON pets
  FOR ALL
  USING (auth.uid() = owner_id);

-- Daily Logs: Owner + assigned sitter can read/write
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY daily_logs_owner ON daily_logs
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM pets WHERE id = pet_id
    )
  );

CREATE POLICY daily_logs_sitter ON daily_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT sitter_id FROM sitter_sessions 
      WHERE pet_id = daily_logs.pet_id 
      AND started_at <= NOW() AND (ended_at IS NULL OR ended_at >= NOW())
    )
  );

-- Daily Tasks: Owner manages their pet's tasks
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY daily_tasks_owner ON daily_tasks
  FOR ALL
  USING (auth.uid() = owner_id);

-- Streaks: Owner can view streaks for their pets
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY streaks_owner ON streaks
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM pets WHERE id = pet_id
    )
  );

-- Sitter Invites: Owners manage their invites
ALTER TABLE sitter_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY sitter_invites_owner ON sitter_invites
  FOR ALL
  USING (auth.uid() = owner_id);

-- Sitter Sessions: Owner + sitter can view
ALTER TABLE sitter_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sitter_sessions_owner ON sitter_sessions
  FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY sitter_sessions_sitter ON sitter_sessions
  FOR SELECT
  USING (auth.uid() = sitter_id);

-- Inventory: Owner can manage
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_owner ON inventory
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM pets WHERE id = pet_id
    )
  );

-- Product Recommendations: Owner can view their recommendations
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_recommendations_owner ON product_recommendations
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM pets WHERE id = pet_id
    )
  );

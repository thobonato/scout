-- =============================================================================
-- SCOUT DATABASE SCHEMA INITIALIZATION
-- Description: Indiscriminately wipes the existing public schema and provisions
--              the clean Scout architecture with Row-Level Security (RLS).
-- =============================================================================
-- =============================================================================
-- 1. INDISCRIMINATE TEARDOWN
-- =============================================================================
-- This block dynamically loops through every table in the 'public' schema and
-- drops it. CASCADE ensures that any dependent objects (like foreign keys or
-- views) are also safely removed.
DO $ $ DECLARE row RECORD;

BEGIN FOR row IN
SELECT
  tablename
FROM
  pg_tables
WHERE
  schemaname = 'public' LOOP EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(row.tablename) || ' CASCADE';

END LOOP;

END $ $;

-- =============================================================================
-- 2. TABLE DEFINITIONS
-- =============================================================================
-- Core Users table handling both Owners and Sitters.
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'sitter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users(email);

CREATE INDEX idx_users_role ON public.users(role);

-- Pet profiles associated with a specific owner.
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  age_months INT,
  weight_lbs DECIMAL(5, 2),
  gender TEXT CHECK (gender IN ('male', 'female')),
  size TEXT CHECK (
    size IN ('small', 'medium', 'large', 'extra-large')
  ),
  coat_color TEXT,
  photo_url TEXT,
  avatar_url TEXT,
  medical_notes TEXT,
  is_spayed_neutered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_pets_owner_id ON public.pets(owner_id);

-- Immutable log of all care activities performed on a pet.
CREATE TABLE public.action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  logger_id UUID NOT NULL REFERENCES public.users(id) ON DELETE
  SET
    NULL,
    session_id UUID,
    -- References sitter_sessions (created later)
    activity_type TEXT NOT NULL CHECK (activity_type IN ('feed', 'play', 'medicine')),
    item_name TEXT,
    photo_url TEXT,
    notes TEXT,
    logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_action_logs_pet_id ON public.action_logs(pet_id);

CREATE INDEX idx_action_logs_logger_id ON public.action_logs(logger_id);

CREATE INDEX idx_action_logs_logged_at ON public.action_logs(logged_at);

-- Real-time metrics for pet care needs.
CREATE TABLE public.fulfillment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL UNIQUE REFERENCES public.pets(id) ON DELETE CASCADE,
  hunger_percentage INT DEFAULT 0 CHECK (
    hunger_percentage BETWEEN 0
    AND 100
  ),
  exercise_percentage INT DEFAULT 0 CHECK (
    exercise_percentage BETWEEN 0
    AND 100
  ),
  medicine_percentage INT DEFAULT 0 CHECK (
    medicine_percentage BETWEEN 0
    AND 100
  ),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_fulfillment_pet_id ON public.fulfillment(pet_id);

-- Gamification: Pet experience and leveling.
CREATE TABLE public.xp_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL UNIQUE REFERENCES public.pets(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_xp_state_pet_id ON public.xp_state(pet_id);

-- Gamification: Unlocked milestone badges.
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (
    achievement_type IN (
      'first_feed',
      'first_play',
      'streak_3',
      'streak_7',
      'streak_30',
      'photo_pro',
      'night_owl',
      'early_bird',
      'perfect_day',
      'level_5',
      'level_10'
    )
  ),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pet_id, achievement_type)
);

CREATE INDEX idx_achievements_pet_id ON public.achievements(pet_id);

-- Gamification: Consecutive care streaks.
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL UNIQUE REFERENCES public.pets(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  last_perfect_date DATE,
  all_time_best INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_streaks_pet_id ON public.streaks(pet_id);

-- Time-bound access grants for temporary caregivers.
CREATE TABLE public.sitter_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  sitter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  drop_off_time TEXT,
  pick_up_time TEXT,
  role TEXT NOT NULL DEFAULT 'full_access' CHECK (role IN ('full_access', 'view_only')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pet_id, sitter_id, start_date, end_date)
);

CREATE INDEX idx_sitter_sessions_pet_id ON public.sitter_sessions(pet_id);

CREATE INDEX idx_sitter_sessions_sitter_id ON public.sitter_sessions(sitter_id);

-- Add the foreign key to action_logs now that sitter_sessions exists
ALTER TABLE
  public.action_logs
ADD
  CONSTRAINT fk_action_logs_session FOREIGN KEY (session_id) REFERENCES public.sitter_sessions(id) ON DELETE
SET
  NULL;

-- Token-based invitations for on-boarding sitters.
CREATE TABLE public.sitter_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invite_token TEXT NOT NULL UNIQUE,
  invite_email TEXT NOT NULL,
  accepted_by_id UUID REFERENCES public.users(id) ON DELETE
  SET
    NULL,
    is_claimed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_sitter_invites_token ON public.sitter_invites(invite_token);

-- Tracking system for pet supplies and restock dates.
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (
    item_type IN ('food', 'medicine', 'toy', 'other')
  ),
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit TEXT CHECK (unit IN ('bag', 'can', 'bottle', 'box', 'count')),
  restock_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_inventory_pet_id ON public.inventory(pet_id);

-- AI-generated product suggestions (cached for performance).
CREATE TABLE public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  chewy_link TEXT,
  confidence DECIMAL(3, 2),
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI-generated weekly health analysis based on activity logs.
CREATE TABLE public.health_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  summary TEXT,
  highlights TEXT [],
  concerns TEXT [],
  recommendations TEXT [],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY (RLS) ACTIVATION
-- =============================================================================
ALTER TABLE
  public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.pets ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.action_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.fulfillment ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.xp_state ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.achievements ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.streaks ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.sitter_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.sitter_invites ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.inventory ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.product_recommendations ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  public.health_insights ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 4. RLS POLICIES
-- =============================================================================
-- Users
CREATE POLICY "Users can view own profile" ON public.users FOR
SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users FOR
UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Pets
CREATE POLICY "Owner can view own pet" ON public.pets FOR
SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can update own pet" ON public.pets FOR
UPDATE
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can create pet" ON public.pets FOR
INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can delete pet" ON public.pets FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Sitter can view pet during session" ON public.pets FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = pets.id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
        AND CURRENT_DATE BETWEEN ss.start_date
        AND ss.end_date
    )
  );

-- Action Logs
CREATE POLICY "Owner can view action logs" ON public.action_logs FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = action_logs.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owner can log actions" ON public.action_logs FOR
INSERT
  WITH CHECK (
    auth.uid() = logger_id
    AND EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Sitter can view session logs" ON public.action_logs FOR
SELECT
  USING (
    action_logs.session_id IS NOT NULL
    AND EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.id = action_logs.session_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
        AND CURRENT_DATE BETWEEN ss.start_date
        AND ss.end_date
    )
  );

CREATE POLICY "Sitter can log actions during session" ON public.action_logs FOR
INSERT
  WITH CHECK (
    session_id IS NOT NULL
    AND auth.uid() = logger_id
    AND EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.id = session_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
        AND CURRENT_DATE BETWEEN ss.start_date
        AND ss.end_date
        AND ss.role = 'full_access'
    )
  );

-- Fulfillment
CREATE POLICY "Owner can view fulfillment" ON public.fulfillment FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = fulfillment.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Sitter can view fulfillment" ON public.fulfillment FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = fulfillment.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

CREATE POLICY "Sitter can update fulfillment" ON public.fulfillment FOR
UPDATE
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = fulfillment.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
        AND ss.role = 'full_access'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = fulfillment.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
        AND ss.role = 'full_access'
    )
  );

-- Gamification (XP, Achievements, Streaks) - Owner Read
CREATE POLICY "Owner can view xp_state" ON public.xp_state FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = xp_state.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owner can view achievements" ON public.achievements FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = achievements.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owner can view streaks" ON public.streaks FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = streaks.pet_id
        AND p.owner_id = auth.uid()
    )
  );

-- Gamification - Sitter Read
CREATE POLICY "Sitter can view xp_state" ON public.xp_state FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = xp_state.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

CREATE POLICY "Sitter can view achievements" ON public.achievements FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = achievements.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

CREATE POLICY "Sitter can view streaks" ON public.streaks FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = streaks.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

-- Sitter Sessions
CREATE POLICY "Owner can view sitter sessions" ON public.sitter_sessions FOR
SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can create sitter session" ON public.sitter_sessions FOR
INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update sitter session" ON public.sitter_sessions FOR
UPDATE
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Sitter can view own sessions" ON public.sitter_sessions FOR
SELECT
  USING (auth.uid() = sitter_id);

-- Sitter Invites
CREATE POLICY "Owner can view invites" ON public.sitter_invites FOR
SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can create invites" ON public.sitter_invites FOR
INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can delete invites" ON public.sitter_invites FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Sitter can claim invite" ON public.sitter_invites FOR
UPDATE
  USING (
    invite_email = auth.email()
    AND is_claimed = FALSE
  ) WITH CHECK (invite_email = auth.email());

-- Inventory
CREATE POLICY "Owner can view inventory" ON public.inventory FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = inventory.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owner can manage inventory" ON public.inventory FOR
INSERT
  WITH CHECK (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owner can update inventory" ON public.inventory FOR
UPDATE
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = inventory.pet_id
        AND p.owner_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = inventory.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Sitter can view inventory" ON public.inventory FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = inventory.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

-- AI Features (Recommendations & Insights)
CREATE POLICY "Owner can view recommendations" ON public.product_recommendations FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = product_recommendations.pet_id
        AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Sitter can view recommendations" ON public.product_recommendations FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.sitter_sessions ss
      WHERE
        ss.pet_id = product_recommendations.pet_id
        AND ss.sitter_id = auth.uid()
        AND ss.is_active = TRUE
    )
  );

CREATE POLICY "Owner can view health insights" ON public.health_insights FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        public.pets p
      WHERE
        p.id = health_insights.pet_id
        AND p.owner_id = auth.uid()
    )
  );
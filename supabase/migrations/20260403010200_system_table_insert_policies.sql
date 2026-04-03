-- =============================================================================
-- INSERT POLICIES FOR SYSTEM-WRITTEN TABLES
-- These tables are written by server-side API routes (not directly by users),
-- but the routes run under the anon key so RLS still applies.
-- Owners can insert rows for their own pets.
-- =============================================================================

-- product_recommendations: owner can insert/delete cached AI results
CREATE POLICY "Owner can insert recommendations" ON public.product_recommendations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = product_recommendations.pet_id
      AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owner can delete recommendations" ON public.product_recommendations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = product_recommendations.pet_id
      AND p.owner_id = auth.uid()
  )
);

-- health_insights: owner can insert cached AI results
CREATE POLICY "Owner can insert health insights" ON public.health_insights
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = health_insights.pet_id
      AND p.owner_id = auth.uid()
  )
);

-- fulfillment, xp_state, streaks, achievements: owner can insert initial rows
CREATE POLICY "Owner can insert fulfillment" ON public.fulfillment
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = fulfillment.pet_id
      AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owner can insert xp_state" ON public.xp_state
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = xp_state.pet_id
      AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owner can insert streaks" ON public.streaks
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = streaks.pet_id
      AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owner can insert achievements" ON public.achievements
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = achievements.pet_id
      AND p.owner_id = auth.uid()
  )
);

-- Owner can update their own fulfillment
CREATE POLICY "Owner can update fulfillment" ON public.fulfillment
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = fulfillment.pet_id
      AND p.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = fulfillment.pet_id
      AND p.owner_id = auth.uid()
  )
);

-- Owner can update xp and streaks
CREATE POLICY "Owner can update xp_state" ON public.xp_state
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = xp_state.pet_id
      AND p.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = xp_state.pet_id
      AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Owner can update streaks" ON public.streaks
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = streaks.pet_id
      AND p.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pets p
    WHERE p.id = streaks.pet_id
      AND p.owner_id = auth.uid()
  )
);

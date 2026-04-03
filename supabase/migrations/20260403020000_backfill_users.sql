-- Backfill public.users for any auth users that signed up before the
-- on_auth_user_created trigger was installed. Safe to run multiple times.
INSERT INTO public.users (id, email, display_name, role)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data ->> 'display_name',
    split_part(au.email, '@', 1)
  ),
  COALESCE(au.raw_user_meta_data ->> 'role', 'owner')
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Also make the signup trigger idempotent so it won't error on re-runs.
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'role', 'owner')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

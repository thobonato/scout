-- 1. Create a function that copies data from auth.users to public.users
CREATE
OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO
  public.users (id, email, display_name, role)
VALUES
  (
    new.id,
    new.email,
    -- Extract the display_name from metadata, or default to email prefix
    COALESCE(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(new.raw_user_meta_data ->> 'role', 'owner')
  );

RETURN new;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to fire that function every time a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER
INSERT
  ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
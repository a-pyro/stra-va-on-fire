DROP TABLE IF EXISTS profiles CASCADE;

-- Enable MODDATETIME extension for handling updated_at column
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

----------------------------------------------------------------------
drop type token_info cascade;

  CREATE TYPE token_info AS (
      expires_at BIGINT,
      expires_in INT,
      refresh_token VARCHAR(255),
      access_token VARCHAR(255)
  );
----------------------------------------------------------------------
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  strava_token token_info null,
  display_name text null,
  avatar_url text null,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default current_timestamp,
  primary key (id)
);

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY
  "Can only view own profile data."
  ON public.profiles
  FOR SELECT
  USING ( auth.uid() = id );


  CREATE POLICY
  "Can only update own profile data."
  ON public.profiles
  FOR UPDATE
  USING ( auth.uid() = id );
----------------------------------------------------------------------

drop function if exists public.create_profile_for_new_user() cascade;
----------------------------------------------------------------------
CREATE FUNCTION
  public.create_profile_for_new_user()
  RETURNS TRIGGER AS
  $$
  BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'user_name'
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
----------------------------------------------------------------------
-- Drop the trigger for creating profile on signup
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

-- Drop the triggers for handling updated_at column
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;

----------------------------------------------------------------------
-- Create triggers to handle the updated_at column
CREATE TRIGGER
  create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.create_profile_for_new_user();
    
CREATE TRIGGER handle_updated_at_profiles BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

----------------------------------------------------------------------

-- Example policy to restrict access to profiles
create policy "allow access to own profile"
on public.profiles
for select
using (auth.uid() = id);

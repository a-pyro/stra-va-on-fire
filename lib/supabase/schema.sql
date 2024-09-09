DROP TABLE IF EXISTS profiles CASCADE;

-- Enable MODDATETIME extension for handling updated_at column
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

----------------------------------------------------------------------
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  access_token text,
  refresh_token text,
  full_name text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default current_timestamp,
  expires_at timestamp with time zone, -- Track token expiration
  primary key (id)
);

----------------------------------------------------------------------

drop function if exists public.handle_new_user() cascade;
----------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
end;
$$;

----------------------------------------------------------------------
-- Drop the trigger for creating profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the triggers for handling updated_at column
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;

----------------------------------------------------------------------
-- Create triggers to handle the updated_at column
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
    
CREATE TRIGGER handle_updated_at_profiles BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

----------------------------------------------------------------------

-- Example policy to restrict access to profiles
create policy "allow access to own profile"
on public.profiles
for select
using (auth.uid() = id);

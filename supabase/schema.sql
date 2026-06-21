-- Drop existing triggers and functions if they exist to allow re-runs
DROP TRIGGER IF EXISTS trigger_protect_admin_fields ON public.profiles;
DROP TRIGGER IF EXISTS trigger_calculate_profile_completion ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.protect_admin_fields();
DROP FUNCTION IF EXISTS public.calculate_profile_completion();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  state TEXT,
  city TEXT,
  address TEXT,
  next_of_kin_name TEXT,
  next_of_kin_phone TEXT,
  next_of_kin_relationship TEXT,
  beneficiary_name TEXT,
  beneficiary_phone TEXT,
  beneficiary_relationship TEXT,
  profile_completion_percent INT DEFAULT 0,
  status TEXT DEFAULT 'pending_registration' CHECK (status IN ('pending_registration', 'active_basic', 'profile_incomplete', 'pending_approval', 'approved', 'suspended')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin (runs as SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Allow select for owners and admins" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin()
  );

CREATE POLICY "Allow update for owners and admins" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin()
  );

-- Trigger to automatically calculate profile completion percent
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_fields INT := 13;
  filled_fields INT := 0;
BEGIN
  IF NEW.full_name IS NOT NULL AND NEW.full_name <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.phone IS NOT NULL AND NEW.phone <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.date_of_birth IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.gender IS NOT NULL AND NEW.gender <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.state IS NOT NULL AND NEW.state <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.city IS NOT NULL AND NEW.city <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.address IS NOT NULL AND NEW.address <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.next_of_kin_name IS NOT NULL AND NEW.next_of_kin_name <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.next_of_kin_phone IS NOT NULL AND NEW.next_of_kin_phone <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.next_of_kin_relationship IS NOT NULL AND NEW.next_of_kin_relationship <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.beneficiary_name IS NOT NULL AND NEW.beneficiary_name <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.beneficiary_phone IS NOT NULL AND NEW.beneficiary_phone <> '' THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.beneficiary_relationship IS NOT NULL AND NEW.beneficiary_relationship <> '' THEN filled_fields := filled_fields + 1; END IF;

  NEW.profile_completion_percent := (filled_fields * 100) / total_fields;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_profile_completion
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.calculate_profile_completion();

-- Trigger to protect role/status fields from non-admin updates (while allowing user submission transitions)
CREATE OR REPLACE FUNCTION public.protect_admin_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is updating their own profile and is not an admin
  IF auth.uid() = NEW.id AND (SELECT COALESCE(role, 'user') FROM public.profiles WHERE id = auth.uid()) <> 'admin' THEN
    -- Prevent role modification entirely
    NEW.role := OLD.role;
    
    -- Allow status transition ONLY if it goes from ('pending_registration', 'profile_incomplete') to 'pending_approval'
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NOT (
        (OLD.status IN ('pending_registration', 'profile_incomplete')) AND 
        (NEW.status = 'pending_approval')
      ) THEN
        NEW.status := OLD.status;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_protect_admin_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_admin_fields();

-- Trigger to automatically create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, status, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    'pending_registration',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Useful SQL Snippets for Testing:
-- 1. To make a user an Admin:
--    UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid';
-- 2. To reset a user status:
--    UPDATE public.profiles SET status = 'pending_registration', profile_completion_percent = 0 WHERE id = 'your-user-uuid';

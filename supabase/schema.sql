-- Drop existing triggers and functions if they exist to allow re-runs
DROP TRIGGER IF EXISTS trigger_protect_admin_fields ON public.profiles;
DROP TRIGGER IF EXISTS trigger_calculate_profile_completion ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;

DROP POLICY IF EXISTS "Admins can manage savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Admins can view savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Users can view savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Admins can create savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Admins can update savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Admins can delete savings plans" ON public.savings_plans;
DROP POLICY IF EXISTS "Owner or admin can read notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow select for owners and admins" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read of approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update for owners and admins" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

DROP FUNCTION IF EXISTS public.protect_admin_fields();
DROP FUNCTION IF EXISTS public.calculate_profile_completion();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- Ensure UUID generation support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  registration_type TEXT DEFAULT 'individual' CHECK (registration_type IN ('individual', 'company')),
  company_name TEXT,
  company_registration_number TEXT,
  company_email TEXT,
  company_type TEXT,
  registered_office_address TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  state TEXT,
  city TEXT,
  address TEXT,
  next_of_kin_name TEXT,
  next_of_kin_phone TEXT,
  next_of_kin_relationship TEXT,
  bank_name TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  profile_completion_percent INT DEFAULT 0,
  status TEXT DEFAULT 'pending_registration' CHECK (status IN ('pending_registration', 'active_basic', 'profile_incomplete', 'pending_approval', 'approved', 'suspended')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Savings plan registry for admin-managed member savings cycles
CREATE TABLE IF NOT EXISTS public.savings_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  contribution_amount NUMERIC(14,2) NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  cashout_amount NUMERIC(14,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  account_name TEXT,
  account_bank TEXT,
  account_number TEXT,
  recipients_mode TEXT NOT NULL CHECK (recipients_mode IN ('all', 'selected', 'individual')),
  recipient_ids UUID[],
  recipient_id UUID,
  auto_reminder BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_plans_recipient_ids ON public.savings_plans USING GIN(recipient_ids);
CREATE INDEX IF NOT EXISTS idx_savings_plans_recipient_id ON public.savings_plans(recipient_id);
CREATE INDEX IF NOT EXISTS idx_savings_plans_admin_id ON public.savings_plans(admin_id);

-- Notifications table for member alerts and savings reminders
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'savings')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON public.notifications(profile_id);

-- Enable Row Level Security (RLS) and policies for new admin tables
ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Admins can manage savings plans" ON public.savings_plans
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view savings plans" ON public.savings_plans
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can create savings plans" ON public.savings_plans
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update savings plans" ON public.savings_plans
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete savings plans" ON public.savings_plans
  FOR DELETE
  USING (public.is_admin());

CREATE POLICY "Owner or admin can read notifications" ON public.notifications
  FOR SELECT
  USING (public.is_admin() OR auth.uid() = profile_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update notifications" ON public.notifications
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete notifications" ON public.notifications
  FOR DELETE
  USING (public.is_admin());

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for owners and admins" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin()
  );

CREATE POLICY "Allow public read of approved profiles" ON public.profiles
  FOR SELECT USING (
    status = 'approved'
  );

CREATE POLICY "Allow update for owners and admins" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin()
  );

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (
    public.is_admin()
  );

-- Trigger to automatically calculate profile completion percent
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_fields INT := 13;
  filled_fields INT := 0;
BEGIN
  IF NEW.registration_type = 'company' THEN
    total_fields := 8;
    IF NEW.company_name IS NOT NULL AND NEW.company_name <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.company_registration_number IS NOT NULL AND NEW.company_registration_number <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.company_email IS NOT NULL AND NEW.company_email <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.company_type IS NOT NULL AND NEW.company_type <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.registered_office_address IS NOT NULL AND NEW.registered_office_address <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bank_name IS NOT NULL AND NEW.bank_name <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bank_account_name IS NOT NULL AND NEW.bank_account_name <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bank_account_number IS NOT NULL AND NEW.bank_account_number <> '' THEN filled_fields := filled_fields + 1; END IF;
  ELSE
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
    IF NEW.bank_name IS NOT NULL AND NEW.bank_name <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bank_account_name IS NOT NULL AND NEW.bank_account_name <> '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bank_account_number IS NOT NULL AND NEW.bank_account_number <> '' THEN filled_fields := filled_fields + 1; END IF;
  END IF;

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
  INSERT INTO public.profiles (
    id,
    full_name,
    registration_type,
    company_name,
    company_registration_number,
    company_email,
    company_type,
    registered_office_address,
    status,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'registration_type', 'individual'),
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'company_registration_number',
    NEW.raw_user_meta_data->>'company_email',
    NEW.raw_user_meta_data->>'company_type',
    NEW.raw_user_meta_data->>'registered_office_address',
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

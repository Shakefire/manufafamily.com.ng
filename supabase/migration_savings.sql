-- Migration: Add missing beneficiary fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS beneficiary_name TEXT,
ADD COLUMN IF NOT EXISTS beneficiary_phone TEXT,
ADD COLUMN IF NOT EXISTS beneficiary_relationship TEXT;

-- Ensure savings_plans table exists with all columns
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

-- Ensure notifications table exists
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_savings_plans_recipient_ids ON public.savings_plans USING GIN(recipient_ids);
CREATE INDEX IF NOT EXISTS idx_savings_plans_recipient_id ON public.savings_plans(recipient_id);
CREATE INDEX IF NOT EXISTS idx_savings_plans_admin_id ON public.savings_plans(admin_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(profile_id, read);

-- Enable RLS
ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS for savings_plans
DROP POLICY IF EXISTS "Admins can manage savings plans" ON public.savings_plans;
CREATE POLICY "Admins can manage savings plans" ON public.savings_plans
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can view savings plans" ON public.savings_plans;
CREATE POLICY "Users can view savings plans" ON public.savings_plans
  FOR SELECT USING (
    public.is_admin()
    OR recipients_mode = 'all'
    OR (recipients_mode = 'selected' AND auth.uid() = ANY(recipient_ids))
    OR (recipients_mode = 'individual' AND auth.uid() = recipient_id)
  );

-- RLS for notifications
DROP POLICY IF EXISTS "Owner or admin can read notifications" ON public.notifications;
CREATE POLICY "Owner or admin can read notifications" ON public.notifications
  FOR SELECT USING (public.is_admin() OR auth.uid() = profile_id);

DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can update notifications" ON public.notifications
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete notifications" ON public.notifications
  FOR DELETE USING (public.is_admin());

-- RLS for profiles (if not already set)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select for owners and admins" ON public.profiles;
CREATE POLICY "Allow select for owners and admins" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Allow update for owners and admins" ON public.profiles;
CREATE POLICY "Allow update for owners and admins" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

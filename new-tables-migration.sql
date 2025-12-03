-- ============================================
-- NEW TABLES FOR MVP
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text NULL,
  stripe_subscription_id text NULL,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions USING btree (stripe_customer_id);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 2. APP_FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.app_feedback (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  rating integer NULL,
  category text NULL,
  message text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT app_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT app_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Indexes for feedback
CREATE INDEX IF NOT EXISTS idx_app_feedback_user_id ON public.app_feedback USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_app_feedback_created_at ON public.app_feedback USING btree (created_at DESC);

-- Enable RLS
ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.app_feedback;
CREATE POLICY "Users can view own feedback" ON public.app_feedback
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own feedback" ON public.app_feedback;
CREATE POLICY "Users can insert own feedback" ON public.app_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Marketing Buddy - Complete Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (already exists)
-- ============================================
-- Stores user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  full_name text NULL,
  avatar_url text NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- ============================================
-- 2. ONBOARDING TABLE (already exists)
-- ============================================
-- Stores user onboarding data
CREATE TABLE IF NOT EXISTS public.onboarding (
  user_id uuid NOT NULL,
  data jsonb NOT NULL,
  onboarding_completed boolean NULL DEFAULT false,
  updated_at timestamp with time zone NULL DEFAULT now(),
  product_name text NULL,
  website text NULL,
  value_prop text NULL,
  north_star_goal text NULL,
  custom_goal text NULL,
  goal_type text NULL,
  goal_amount text NULL,
  goal_timeline integer NULL,
  marketing_strategy text NULL,
  current_users integer NULL,
  current_mrr numeric(10,2) NULL,
  launch_date date NULL,
  current_platforms text[] NULL,
  experience_level text NULL,
  preferred_platforms text[] NULL,
  challenges text NULL,
  focus_area text NULL,
  daily_task_count integer NULL,
  website_analysis jsonb NULL,
  plan jsonb NULL,
  goals jsonb NULL,
  milestones jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT onboarding_pkey PRIMARY KEY (user_id),
  CONSTRAINT onboarding_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT onboarding_goal_type_check CHECK (
    (goal_type IS NULL) OR (
      goal_type = ANY (
        ARRAY['users'::text, 'revenue'::text, 'awareness'::text, 'engagement'::text, 'conversion'::text, 'retention'::text]
      )
    )
  )
);

-- Indexes for onboarding
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON public.onboarding USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_current_platforms ON public.onboarding USING gin (current_platforms);
CREATE INDEX IF NOT EXISTS idx_onboarding_preferred_platforms ON public.onboarding USING gin (preferred_platforms);
CREATE INDEX IF NOT EXISTS idx_onboarding_website_analysis ON public.onboarding USING gin (website_analysis jsonb_path_ops);

-- ============================================
-- 3. TASKS TABLE
-- ============================================
-- Stores daily marketing tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NULL,
  category text NULL, -- 'content', 'social', 'seo', 'email', 'analytics', 'other'
  priority text NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
  due_date date NULL,
  completed_at timestamp with time zone NULL,
  estimated_minutes integer NULL,
  actual_minutes integer NULL,
  platform text NULL, -- 'twitter', 'linkedin', 'instagram', etc.
  related_content_id uuid NULL, -- Links to content table
  metadata jsonb NULL, -- Additional flexible data
  completion_note text NULL,
  performance_data jsonb NULL,
  skipped_count integer NOT NULL DEFAULT 0,
  last_status_change timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT tasks_status_check CHECK (status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text, 'skipped'::text])),
  CONSTRAINT tasks_priority_check CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))
);

-- Indexes for tasks
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks USING btree (status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks USING btree (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks USING btree (created_at DESC);

-- ============================================
-- 3b. WEEKLY_REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  week_start_date date NOT NULL,
  traction_channel text NULL,
  waste_channel text NULL,
  focus_next_week text[] NULL,
  feeling integer NULL CHECK (feeling BETWEEN 1 AND 10),
  notes text NULL,
  ai_summary jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT weekly_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_id ON public.weekly_reviews USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_week_start ON public.weekly_reviews USING btree (week_start_date);

-- ============================================
-- 4. CONTENT TABLE
-- ============================================
-- Stores generated and published content
CREATE TABLE IF NOT EXISTS public.content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NULL,
  content_text text NOT NULL,
  platform text NOT NULL, -- 'twitter', 'linkedin', 'blog', 'email', etc.
  content_type text NULL, -- 'post', 'thread', 'article', 'email', etc.
  status text NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'scheduled', 'archived'
  published_at timestamp with time zone NULL,
  scheduled_for timestamp with time zone NULL,
  url text NULL, -- URL if published
  engagement_metrics jsonb NULL, -- likes, shares, comments, etc.
  ai_generated boolean DEFAULT true,
  task_id uuid NULL, -- Links to task that generated this
  metadata jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT content_pkey PRIMARY KEY (id),
  CONSTRAINT content_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT content_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks (id) ON DELETE SET NULL,
  CONSTRAINT content_status_check CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text]))
);

-- Indexes for content
CREATE INDEX IF NOT EXISTS idx_content_user_id ON public.content USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_content_platform ON public.content USING btree (platform);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content USING btree (status);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON public.content USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON public.content USING btree (published_at DESC);

-- ============================================
-- 5. BUDDY_MESSAGES TABLE
-- ============================================
-- Stores conversations with the AI marketing buddy
CREATE TABLE IF NOT EXISTS public.buddy_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  role text NOT NULL, -- 'user' or 'assistant'
  message text NOT NULL,
  context jsonb NULL, -- Additional context for the conversation
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT buddy_messages_pkey PRIMARY KEY (id),
  CONSTRAINT buddy_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT buddy_messages_role_check CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text]))
);

-- Indexes for buddy_messages
CREATE INDEX IF NOT EXISTS idx_buddy_messages_user_id ON public.buddy_messages USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_buddy_messages_created_at ON public.buddy_messages USING btree (created_at DESC);

-- ============================================
-- 6. ANALYTICS TABLE
-- ============================================
-- Stores marketing analytics and metrics
CREATE TABLE IF NOT EXISTS public.analytics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  metric_name text NOT NULL, -- 'website_visits', 'signups', 'conversions', etc.
  metric_value numeric NOT NULL,
  metric_date date NOT NULL,
  platform text NULL, -- Which platform this metric is from
  metadata jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT analytics_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON public.analytics USING btree (metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON public.analytics USING btree (metric_name);

-- ============================================
-- 7. STREAKS TABLE
-- ============================================
-- Tracks user engagement streaks
CREATE TABLE IF NOT EXISTS public.streaks (
  user_id uuid NOT NULL,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date NULL,
  total_tasks_completed integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT streaks_pkey PRIMARY KEY (user_id),
  CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_onboarding_updated_at ON public.onboarding;
CREATE TRIGGER trg_onboarding_updated_at
  BEFORE UPDATE ON public.onboarding
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_content_updated_at ON public.content;
CREATE TRIGGER trg_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_streaks_updated_at ON public.streaks;
CREATE TRIGGER trg_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Buddy pairs table: simple manual matching
CREATE TABLE IF NOT EXISTS public.buddy_pairs (
  user_id uuid NOT NULL,
  buddy_user_id uuid NOT NULL,
  status text NULL DEFAULT 'active', -- 'active','pending','inactive'
  matched_by text NULL DEFAULT 'admin',
  matched_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT buddy_pairs_pkey PRIMARY KEY (user_id, buddy_user_id),
  CONSTRAINT buddy_pairs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT buddy_pairs_buddy_id_fkey FOREIGN KEY (buddy_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
ALTER TABLE public.buddy_pairs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7b. MILESTONES TABLE (new)
-- ============================================
-- Tracks user milestones (goal achievements and user-added milestones)
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NULL,
  emoji text NULL,
  type text NOT NULL DEFAULT 'user_added', -- 'goal_achieved' | 'user_added'
  goal_type text NULL, -- 'users' | 'revenue' | etc.
  progress_current numeric NULL,
  progress_target numeric NULL,
  unit text NULL,
  unlocked boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  date date NULL,
  sort_order integer NULL DEFAULT 999,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT milestones_pkey PRIMARY KEY (id),
  CONSTRAINT milestones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Indexes for milestones
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON public.milestones USING btree (date DESC);

-- Trigger for milestones updated_at
DROP TRIGGER IF EXISTS trg_milestones_updated_at ON public.milestones;
CREATE TRIGGER trg_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Milestones RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own milestones" ON public.milestones;
CREATE POLICY "Users can view own milestones" ON public.milestones
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own milestones" ON public.milestones;
CREATE POLICY "Users can insert own milestones" ON public.milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own milestones" ON public.milestones;
CREATE POLICY "Users can update own milestones" ON public.milestones
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own milestones" ON public.milestones;
CREATE POLICY "Users can delete own milestones" ON public.milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Onboarding policies
DROP POLICY IF EXISTS "Users can view own onboarding" ON public.onboarding;
CREATE POLICY "Users can view own onboarding" ON public.onboarding
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own onboarding" ON public.onboarding;
CREATE POLICY "Users can update own onboarding" ON public.onboarding
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own onboarding" ON public.onboarding;
CREATE POLICY "Users can insert own onboarding" ON public.onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Weekly reviews policies
DROP POLICY IF EXISTS "Users can view own weekly reviews" ON public.weekly_reviews;
CREATE POLICY "Users can view own weekly reviews" ON public.weekly_reviews
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly reviews" ON public.weekly_reviews;
CREATE POLICY "Users can insert own weekly reviews" ON public.weekly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own weekly reviews" ON public.weekly_reviews;
CREATE POLICY "Users can update own weekly reviews" ON public.weekly_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Buddy pairs policies (both sides can see)
DROP POLICY IF EXISTS "Users can view their buddy pairs" ON public.buddy_pairs;
CREATE POLICY "Users can view their buddy pairs" ON public.buddy_pairs
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

DROP POLICY IF EXISTS "Admins can insert buddy pairs" ON public.buddy_pairs;
CREATE POLICY "Admins can insert buddy pairs" ON public.buddy_pairs
  FOR INSERT WITH CHECK (true);

-- Content policies
DROP POLICY IF EXISTS "Users can view own content" ON public.content;
CREATE POLICY "Users can view own content" ON public.content
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own content" ON public.content;
CREATE POLICY "Users can insert own content" ON public.content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own content" ON public.content;
CREATE POLICY "Users can update own content" ON public.content
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own content" ON public.content;
CREATE POLICY "Users can delete own content" ON public.content
  FOR DELETE USING (auth.uid() = user_id);

-- Buddy messages policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.buddy_messages;
CREATE POLICY "Users can view own messages" ON public.buddy_messages
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own messages" ON public.buddy_messages;
CREATE POLICY "Users can insert own messages" ON public.buddy_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analytics" ON public.analytics;
CREATE POLICY "Users can insert own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own analytics" ON public.analytics;
CREATE POLICY "Users can update own analytics" ON public.analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Streaks policies
DROP POLICY IF EXISTS "Users can view own streaks" ON public.streaks;
CREATE POLICY "Users can view own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streaks" ON public.streaks;
CREATE POLICY "Users can update own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.streaks;
CREATE POLICY "Users can insert own streaks" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

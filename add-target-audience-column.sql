-- Migration: Add target_audience column to onboarding table
-- Run this in your Supabase SQL editor

-- Add the column
ALTER TABLE public.onboarding 
ADD COLUMN IF NOT EXISTS target_audience jsonb NULL;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_onboarding_target_audience 
ON public.onboarding USING gin (target_audience jsonb_path_ops);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
AND column_name = 'target_audience';

-- Rookies - Store onboarding data on businesses
-- Run this in Supabase SQL Editor

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;

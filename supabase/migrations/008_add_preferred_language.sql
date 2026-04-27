-- Rookies - Add preferred language to businesses
-- Run this in Supabase SQL Editor

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en';

-- Rookies - Ensure users.phone exists
-- Run this in Supabase SQL Editor

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone TEXT;

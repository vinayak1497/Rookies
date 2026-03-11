-- ============================================
-- Rookies - Add Users Table for Firebase Auth
-- Run this in Supabase SQL Editor
-- ============================================

-- ─── Users (Firebase Auth identity records) ───
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast Firebase UID lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

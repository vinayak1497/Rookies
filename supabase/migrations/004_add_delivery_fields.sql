-- ============================================
-- Rookies - Delivery Tracking Fields
-- Run this in Supabase SQL Editor
-- ============================================

-- Normalize statuses to delivery lifecycle
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'PLACED';
UPDATE orders SET status = 'PLACED' WHERE status IS NULL OR status = 'pending';
UPDATE orders SET status = 'CONFIRMED' WHERE status = 'confirmed';
UPDATE orders SET status = 'PREPARING' WHERE status = 'in_progress';
UPDATE orders SET status = 'DELIVERED' WHERE status = 'completed';

-- Delivery timestamps and OTP
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_started_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS otp TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS otp_verified BOOLEAN DEFAULT false;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_started ON orders(delivery_started_at);

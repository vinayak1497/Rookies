-- ============================================
-- Rookies - Adapt orders table for WhatsApp / n8n flat schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Drop the foreign-key constraints that block text-based business_id
--    and optional customer_id
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_business_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

-- 2. Change business_id from UUID to TEXT so n8n can send e.g. "rookies-demo"
ALTER TABLE orders ALTER COLUMN business_id TYPE TEXT USING business_id::TEXT;

-- 3. Make order_number optional (webhook orders derive it from the UUID)
ALTER TABLE orders ALTER COLUMN order_number DROP NOT NULL;

-- 4. Give total_amount a default of 0
ALTER TABLE orders ALTER COLUMN total_amount SET DEFAULT 0;
ALTER TABLE orders ALTER COLUMN total_amount DROP NOT NULL;

-- 5. Add flat WhatsApp-specific columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name  TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items          JSONB DEFAULT '[]'::JSONB;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_time  TEXT;

-- 6. Index for fast source-based filtering
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);

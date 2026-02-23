-- ============================================
-- Rookies - Initial Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Businesses ───
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT, -- 'home_baker', 'kirana', 'instagram_brand', 'other'
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  gst_number TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Business Members ───
CREATE TABLE business_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  role TEXT DEFAULT 'owner', -- 'owner', 'admin', 'staff', 'viewer'
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- ─── Orders ───
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  order_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  source TEXT, -- 'whatsapp', 'instagram', 'walk_in', 'phone'
  delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_business_status ON orders(business_id, status);
CREATE INDEX idx_orders_business_created ON orders(business_id, created_at);

-- ─── Customers ───
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_customers_business ON customers(business_id);

-- ─── Payments ───
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT, -- 'upi', 'cash', 'bank_transfer', 'card'
  status TEXT DEFAULT 'pending', -- 'pending', 'received', 'failed'
  transaction_id TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_business_status ON payments(business_id, status);

-- ─── Inventory Items ───
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT, -- 'kg', 'g', 'pcs', 'liters'
  cost_price DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  low_stock_at INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inventory_business ON inventory_items(business_id);

-- ─── Activity Logs ───
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL, -- 'order_created', 'payment_received', etc.
  entity TEXT, -- 'order', 'payment', 'inventory', 'customer'
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_business_created ON activity_logs(business_id, created_at);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ─── Helper function: Get user's business IDs ───
CREATE OR REPLACE FUNCTION get_user_business_ids()
RETURNS SETOF UUID AS $$
  SELECT business_id
  FROM business_members
  WHERE user_id = auth.uid()
    AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── Businesses: Users can only see businesses they belong to ───
CREATE POLICY "Users can view their businesses"
  ON businesses FOR SELECT
  USING (id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can update their businesses"
  ON businesses FOR UPDATE
  USING (id IN (SELECT get_user_business_ids()));

-- ─── Business Members: Users can see members of their businesses ───
CREATE POLICY "Users can view business members"
  ON business_members FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

-- ─── Orders: Scoped to user's businesses ───
CREATE POLICY "Users can view their business orders"
  ON orders FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can create orders for their businesses"
  ON orders FOR INSERT
  WITH CHECK (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can update their business orders"
  ON orders FOR UPDATE
  USING (business_id IN (SELECT get_user_business_ids()));

-- ─── Customers: Scoped to user's businesses ───
CREATE POLICY "Users can view their business customers"
  ON customers FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can create customers for their businesses"
  ON customers FOR INSERT
  WITH CHECK (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can update their business customers"
  ON customers FOR UPDATE
  USING (business_id IN (SELECT get_user_business_ids()));

-- ─── Payments: Scoped to user's businesses ───
CREATE POLICY "Users can view their business payments"
  ON payments FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can create payments for their businesses"
  ON payments FOR INSERT
  WITH CHECK (business_id IN (SELECT get_user_business_ids()));

-- ─── Inventory: Scoped to user's businesses ───
CREATE POLICY "Users can view their business inventory"
  ON inventory_items FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can manage their business inventory"
  ON inventory_items FOR ALL
  USING (business_id IN (SELECT get_user_business_ids()));

-- ─── Activity Logs: Scoped to user's businesses ───
CREATE POLICY "Users can view their business activity"
  ON activity_logs FOR SELECT
  USING (business_id IN (SELECT get_user_business_ids()));

CREATE POLICY "Users can create activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (business_id IN (SELECT get_user_business_ids()));

-- ============================================
-- Updated_at trigger function
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

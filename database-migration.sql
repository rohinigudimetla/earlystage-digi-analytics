-- =====================================================
-- SUPABASE DATABASE MIGRATION
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- 1. USERS TABLE
-- Stores co-founder information and Google Calendar credentials
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  google_calendar_id TEXT NOT NULL DEFAULT 'primary',
  google_refresh_token TEXT, -- Will be filled after OAuth
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AVAILABILITY RULES TABLE
-- Defines weekly recurring availability (e.g., Mon-Fri 9 AM - 5 PM)
CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time TIME NOT NULL, -- e.g., '09:00:00'
  end_time TIME NOT NULL, -- e.g., '17:00:00'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week, start_time, end_time)
);

-- 3. BLOCKED SLOTS TABLE
-- Manual overrides for specific dates (vacations, holidays, etc.)
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
-- Stores all scheduled consultations
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  message TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  google_event_id TEXT, -- Reference to Google Calendar event
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDEXES for better performance
CREATE INDEX IF NOT EXISTS idx_availability_rules_user ON availability_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_user ON blocked_slots(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read availability rules" ON availability_rules;
DROP POLICY IF EXISTS "Public can read blocked slots" ON blocked_slots;
DROP POLICY IF EXISTS "Public can read users" ON users;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

-- Allow public read access to availability (needed for booking form)
CREATE POLICY "Public can read availability rules" ON availability_rules FOR SELECT USING (true);
CREATE POLICY "Public can read blocked slots" ON blocked_slots FOR SELECT USING (true);
CREATE POLICY "Public can read users" ON users FOR SELECT USING (true);

-- Allow public insert for bookings (needed for booking form)
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert your co-founder user (MODIFY THE EMAIL AND NAME!)
INSERT INTO users (email, name, google_calendar_id)
VALUES ('admin@earlystage-analytics.com', 'Admin User', 'primary')
ON CONFLICT (email) DO NOTHING;

-- Set default availability: Monday-Friday, 9 AM - 5 PM
-- Get the user_id we just created
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users LIMIT 1;
  
  -- Monday (day 1)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 1, '09:00:00', '17:00:00')
  ON CONFLICT DO NOTHING;
  
  -- Tuesday (day 2)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 2, '09:00:00', '17:00:00')
  ON CONFLICT DO NOTHING;
  
  -- Wednesday (day 3)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 3, '09:00:00', '17:00:00')
  ON CONFLICT DO NOTHING;
  
  -- Thursday (day 4)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 4, '09:00:00', '17:00:00')
  ON CONFLICT DO NOTHING;
  
  -- Friday (day 5)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 5, '09:00:00', '17:00:00')
  ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Database setup complete! ✅' AS status;

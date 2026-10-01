-- Set up default availability for the admin user
-- Monday-Friday, 9 AM - 5 PM

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the admin user's ID
  SELECT id INTO v_user_id FROM users WHERE email = 'admin@earlystage-analytics.com' LIMIT 1;
  
  -- Delete any existing rules for this user (clean slate)
  DELETE FROM availability_rules WHERE user_id = v_user_id;
  
  -- Monday (day 1)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 1, '09:00:00', '17:00:00');
  
  -- Tuesday (day 2)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 2, '09:00:00', '17:00:00');
  
  -- Wednesday (day 3)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 3, '09:00:00', '17:00:00');
  
  -- Thursday (day 4)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 4, '09:00:00', '17:00:00');
  
  -- Friday (day 5)
  INSERT INTO availability_rules (user_id, day_of_week, start_time, end_time)
  VALUES (v_user_id, 5, '09:00:00', '17:00:00');
END $$;

SELECT 'Availability rules created! ✅' AS status;

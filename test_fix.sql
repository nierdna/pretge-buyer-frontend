-- Test script: Verify trigger fix hoạt động đúng
-- Chạy script này SAU KHI đã apply fix_trigger.sql

-- 1. Check trigger definition
SELECT '=== CHECKING TRIGGER ===' as status;
SELECT pg_get_triggerdef((
  SELECT oid FROM pg_trigger 
  WHERE tgname = 'trg_apply_points_on_verify'
));
-- Phải có "AFTER INSERT OR UPDATE" ✅

-- 2. Test với user và quest thực tế
DO $$
DECLARE
  test_user_id UUID;
  test_quest_id UUID;
  test_quest_points INT;
  user_quest_id UUID;
  points_before BIGINT;
  points_after BIGINT;
BEGIN
  -- Lấy user đầu tiên trong database
  SELECT id INTO test_user_id FROM users LIMIT 1;
  
  -- Lấy active quest đầu tiên
  SELECT id, points INTO test_quest_id, test_quest_points 
  FROM quests WHERE status = 'active' LIMIT 1;

  RAISE NOTICE '=== TEST SETUP ===';
  RAISE NOTICE 'User ID: %', test_user_id;
  RAISE NOTICE 'Quest ID: %', test_quest_id;
  RAISE NOTICE 'Quest Points: %', test_quest_points;

  -- Check điểm hiện tại
  SELECT COALESCE(total_points, 0) INTO points_before 
  FROM user_points WHERE user_id = test_user_id;
  
  RAISE NOTICE 'Points BEFORE: %', points_before;

  -- Test: INSERT user_quest với status = verified
  user_quest_id := gen_random_uuid();
  
  INSERT INTO user_quests (
    id, user_id, quest_id, status,
    proof_payload, submitted_at, verified_at
  ) VALUES (
    user_quest_id, test_user_id, test_quest_id, 'verified',
    '{"test": true}'::jsonb, now(), now()
  );

  -- Wait một chút để trigger chạy
  PERFORM pg_sleep(0.1);

  -- Check điểm sau khi insert
  SELECT COALESCE(total_points, 0) INTO points_after 
  FROM user_points WHERE user_id = test_user_id;

  RAISE NOTICE 'Points AFTER: %', points_after;
  RAISE NOTICE '';

  -- Verify kết quả
  IF points_after = points_before + test_quest_points THEN
    RAISE NOTICE '✅ ✅ ✅ SUCCESS! Trigger worked correctly!';
    RAISE NOTICE 'Points increased from % to % (+%)', points_before, points_after, test_quest_points;
  ELSE
    RAISE NOTICE '❌ ❌ ❌ FAILED! Trigger did not work!';
    RAISE NOTICE 'Expected points: %, Actual points: %', points_before + test_quest_points, points_after;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '=== CLEANUP ===';
  
  -- Cleanup: Xóa test data
  DELETE FROM user_quests WHERE id = user_quest_id;
  
  -- Restore original points
  IF points_before = 0 THEN
    DELETE FROM user_points WHERE user_id = test_user_id;
  ELSE
    UPDATE user_points 
    SET total_points = points_before 
    WHERE user_id = test_user_id;
  END IF;
  
  RAISE NOTICE 'Test data cleaned up';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
END $$; 
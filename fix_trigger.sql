-- Fix trigger để chạy cả INSERT và UPDATE
-- Bug: Trigger chỉ chạy AFTER UPDATE nên khi INSERT user_quest với status='verified' thì không cộng điểm

DROP TRIGGER IF EXISTS trg_apply_points_on_verify ON user_quests;

CREATE TRIGGER trg_apply_points_on_verify
AFTER INSERT OR UPDATE ON user_quests
FOR EACH ROW
WHEN (NEW.status = 'verified')
EXECUTE FUNCTION apply_points_on_verify();

-- Verify trigger đã được tạo đúng
SELECT pg_get_triggerdef((SELECT oid FROM pg_trigger WHERE tgname = 'trg_apply_points_on_verify')); 
# 🐛 BUG FIX: Quest Points = 0

## Vấn đề

User verify quest nhưng không nhận được điểm (totalPoints = 0)

## Nguyên nhân

Trigger database chỉ chạy khi UPDATE, không chạy khi INSERT.
→ Code INSERT user_quest với status='verified' → Trigger không chạy → Không cộng điểm

## ✅ Cách Fix

### Bước 1: Chạy SQL vào database

**Option 1: Dùng Supabase Dashboard**

1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung file `fix_trigger.sql` và paste vào
3. Click Run

**Option 2: Dùng psql command line**

```bash
psql -U postgres -d your_database -f fix_trigger.sql
```

**Option 3: Copy-paste SQL này vào database tool của bạn:**

```sql
DROP TRIGGER IF EXISTS trg_apply_points_on_verify ON user_quests;

CREATE TRIGGER trg_apply_points_on_verify
AFTER INSERT OR UPDATE ON user_quests
FOR EACH ROW
WHEN (NEW.status = 'verified')
EXECUTE FUNCTION apply_points_on_verify();
```

### Bước 2: Verify trigger đã fix

**Option 1: Test tự động**
Chạy file `test_fix.sql`:

```bash
psql -U postgres -d your_database -f test_fix.sql
```

Kết quả mong đợi:

```
✅ ✅ ✅ SUCCESS! Trigger worked correctly!
Points increased from 0 to 20 (+20)
```

**Option 2: Test thủ công**
Chạy query này để check trigger definition:

```sql
SELECT pg_get_triggerdef((
  SELECT oid FROM pg_trigger
  WHERE tgname = 'trg_apply_points_on_verify'
));
```

Kết quả phải có: `AFTER INSERT OR UPDATE` ✅

### Bước 3: Test với API thực tế

1. Login lại để lấy token mới
2. Verify một quest bất kỳ
3. Check API `/api/v1/quests/my-stats`
4. `totalPoints` phải > 0 ✅

## 🎯 Kết quả mong đợi

**Trước khi fix:**

```json
{
  "totalPoints": 0, // ❌
  "completedQuests": 1
}
```

**Sau khi fix:**

```json
{
  "totalPoints": 20, // ✅
  "completedQuests": 1
}
```

---

**Nếu vẫn gặp vấn đề, kiểm tra:**

- Trigger function có tồn tại không: `SELECT proname FROM pg_proc WHERE proname = 'apply_points_on_verify';`
- User có tồn tại trong database không
- JWT token có còn valid không (check expiry time)

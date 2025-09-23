# MVP Point + Quest + Referral — ERD & Triển khai

> **Phạm vi:** Giữ core MVP tối giản với **3 bảng** (quests, user_quests, user_points) và bổ sung **Referral** (mã mời + thưởng 10%).  
> **Đặc tính:** Reward **fixed points**, một endpoint duy nhất `POST /quests/{code}/verify`—chỉ ghi DB nếu **verify thành công**.

---

## 1) ERD cập nhật (thêm Referral)

```mermaid
erDiagram
  USERS ||--o{ USER_QUESTS : performs
  QUESTS ||--o{ USER_QUESTS : includes
  USERS ||--|| USER_POINTS : has

  %% Referral self-link & rewards
  USERS ||--o{ USERS : refers
  USERS ||--o{ REFERRAL_REWARDS : earns_as_referrer
  USER_QUESTS ||--o{ REFERRAL_REWARDS : generates
  QUESTS ||--o{ REFERRAL_REWARDS : from_which_quest

  USERS {
    UUID id PK
    VARCHAR invite_code UNIQUE
    UUID referred_by_user_id FK -> USERS.id
  }

  QUESTS {
    UUID id PK
    VARCHAR code UNIQUE
    VARCHAR title
    TEXT description
    ENUM quest_type            -- SOCIAL_FOLLOW/RETWEET/POST, TELEGRAM_JOIN, REFERRAL, LINK_X, LINK_TELE
    ENUM quest_status          -- draft/active/paused/ended
    INT points                 -- fixed reward
    JSONB metadata
    TIMESTAMPTZ start_at
    TIMESTAMPTZ end_at
    TIMESTAMPTZ created_at
    TIMESTAMPTZ updated_at
  }

  USER_QUESTS {
    UUID id PK
    UUID user_id FK -> USERS.id
    UUID quest_id FK -> QUESTS.id
    ENUM verify_status         -- pending/verified/rejected
    JSONB proof_payload
    VARCHAR idempotency_key
    TIMESTAMPTZ submitted_at
    TIMESTAMPTZ verified_at
    TIMESTAMPTZ rejected_at
    TEXT reject_reason
    -- UNIQUE (quest_id, user_id) WHERE status='verified'
    -- UNIQUE (quest_id, user_id, idempotency_key)
  }

  USER_POINTS {
    UUID user_id PK, FK -> USERS.id
    BIGINT total_points
    TIMESTAMPTZ updated_at
  }

  REFERRAL_REWARDS {
    UUID id PK
    UUID referrer_user_id FK -> USERS.id
    UUID referred_user_id FK -> USERS.id
    UUID quest_id FK -> QUESTS.id
    UUID user_quest_id FK -> USER_QUESTS.id
    INT points_earned
    INT percent_bps            -- default 1000 = 10.00%
    TIMESTAMPTZ created_at
    -- UNIQUE (user_quest_id, referrer_user_id)
  }
```

**Quan hệ chính:**

- **USERS 1–N USER_QUESTS**: một user có nhiều lần verified quest.
- **QUESTS 1–N USER_QUESTS**: một quest có nhiều user hoàn thành.
- **USERS 1–1 USER_POINTS**: tổng điểm mỗi user.
- **Referral:** `users.invite_code` (unique), `users.referred_by_user_id` (người mời). Khi user hoàn thành quest, **referrer** nhận **10%** (ghi `referral_rewards`).

---

## 2) DDL (Postgres)

### 2.1. Enums (giữ fixed reward)

```sql
CREATE TYPE quest_type AS ENUM (
  'SOCIAL_FOLLOW',
  'SOCIAL_RETWEET',
  'SOCIAL_POST',
  'TELEGRAM_JOIN',
  'REFERRAL',
  'LINK_X',
  'LINK_TELE'
);

CREATE TYPE quest_status AS ENUM ('draft','active','paused','ended');
CREATE TYPE verify_status AS ENUM ('pending','verified','rejected');
```

### 2.2. Bảng quests (fixed reward)

```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type quest_type NOT NULL,
  status quest_status NOT NULL DEFAULT 'active',
  points INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_type ON quests(type);
```

### 2.3. Bảng user_quests

```sql
CREATE TABLE user_quests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  status verify_status NOT NULL DEFAULT 'pending',
  proof_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key VARCHAR(128),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  reject_reason TEXT,
  UNIQUE (quest_id, user_id, idempotency_key)
);

-- Mỗi user chỉ verified 1 lần cho 1 quest
CREATE UNIQUE INDEX uniq_verified_once_per_user_quest
  ON user_quests(quest_id, user_id)
  WHERE status = 'verified';

CREATE INDEX idx_user_quests_user ON user_quests(user_id);
CREATE INDEX idx_user_quests_quest ON user_quests(quest_id);
CREATE INDEX idx_user_quests_status ON user_quests(status);
```

### 2.4. Bảng user_points

```sql
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.5. Thêm cột referral vào users

```sql
ALTER TABLE users
  ADD COLUMN invite_code VARCHAR(16),
  ADD COLUMN referred_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT chk_users_no_self_ref CHECK (referred_by_user_id IS NULL OR referred_by_user_id <> id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_user_id);
```

### 2.6. Bảng referral_rewards (ghi nhận 10% thưởng)

```sql
CREATE TABLE referral_rewards (
  id UUID PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  user_quest_id UUID NOT NULL REFERENCES user_quests(id) ON DELETE CASCADE,
  points_earned INT NOT NULL,
  percent_bps INT NOT NULL DEFAULT 1000,      -- 1000 bps = 10%
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_quest_id, referrer_user_id)
);

CREATE INDEX idx_ref_rewards_referrer ON referral_rewards(referrer_user_id);
CREATE INDEX idx_ref_rewards_referred ON referral_rewards(referred_user_id);
```

---

## 3) Trigger cộng điểm + 10% referral

> Thay thế trigger cũ để cộng điểm cho **chính user** và **referrer** (nếu có).

```sql
DROP TRIGGER IF EXISTS trg_apply_points_on_verify ON user_quests;
DROP FUNCTION IF EXISTS apply_points_on_verify();

CREATE OR REPLACE FUNCTION apply_points_on_verify()
RETURNS trigger AS $$
DECLARE
  v_points INT;
  v_referrer UUID;
  v_ref_points INT;
BEGIN
  IF NEW.status = 'verified' AND (OLD.status IS DISTINCT FROM 'verified') THEN
    -- 1) Cộng điểm cho chính user
    SELECT q.points INTO v_points FROM quests q WHERE q.id = NEW.quest_id;

    INSERT INTO user_points(user_id, total_points, updated_at)
    VALUES (NEW.user_id, v_points, now())
    ON CONFLICT (user_id)
      DO UPDATE SET total_points = user_points.total_points + EXCLUDED.total_points,
                    updated_at = now();

    -- 2) Cộng 10% cho referrer (nếu có)
    SELECT referred_by_user_id INTO v_referrer FROM users WHERE id = NEW.user_id;

    IF v_referrer IS NOT NULL AND v_referrer <> NEW.user_id THEN
      v_ref_points := (v_points * 10) / 100;
      IF v_ref_points > 0 THEN
        INSERT INTO referral_rewards (
          id, referrer_user_id, referred_user_id, quest_id, user_quest_id,
          points_earned, percent_bps, created_at
        ) VALUES (
          gen_random_uuid(), v_referrer, NEW.user_id, NEW.quest_id, NEW.id,
          v_ref_points, 1000, now()
        )
        ON CONFLICT (user_quest_id, referrer_user_id) DO NOTHING;

        INSERT INTO user_points(user_id, total_points, updated_at)
        VALUES (v_referrer, v_ref_points, now())
        ON CONFLICT (user_id)
          DO UPDATE SET total_points = user_points.total_points + EXCLUDED.total_points,
                        updated_at = now();
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_apply_points_on_verify
AFTER UPDATE ON user_quests
FOR EACH ROW
WHEN (NEW.status = 'verified')
EXECUTE FUNCTION apply_points_on_verify();
```

---

## 4) API tối giản (1 endpoint duy nhất)

**POST `/quests/{code}/verify`**

- **Auth:** JWT Bearer → lấy `user_id`
- **Rate limit:** 5–10 req/min/user
- **Idempotency (khuyến nghị):** header `Idempotency-Key`

**Body (ví dụ chung):**

```json
{
  "proof": {
    "username": "my_x_handle",
    "tweet_url": "https://x.com/.../status/201234",
    "tweet_id": "201234",
    "telegram_user_id": "123456789",
    "telegram_username": "mytg",
    "referred_user_id": "uuid",
    "click_token": "opaque-token"
  },
  "meta": { "user_agent": "Mozilla/5.0", "ip": "203.0.113.10" }
}
```

**Trả về (201 Created – thành công):**

```json
{
  "quest": { "code": "FOLLOW_X", "type": "SOCIAL_FOLLOW", "points": 20 },
  "user": { "id": "..." },
  "result": { "status": "verified", "awarded_points": 20, "total_points": 245 }
}
```

**Lỗi (4xx):** `QUEST_NOT_FOUND`, `QUEST_NOT_ACTIVE`, `ALREADY_VERIFIED`, `VERIFICATION_FAILED`, `RATE_LIMITED`, `INVALID_PROOF`.

---

## 5) Hợp đồng dữ liệu per quest (MVP)

- **SOCIAL_FOLLOW**
  - `quests.metadata`: `{ "handle": "@pretgemarket" }`
  - `proof`: `{ "username": "my_x_handle" }`

- **SOCIAL_RETWEET**
  - `quests.metadata`: `{ "tweet_id": "201234..." }`
  - `proof`: `{ "tweet_url": "...", "tweet_id": "..." }`

- **SOCIAL_POST**
  - `quests.metadata`: `{ "required_tags": ["#PreTGE"], "mention": "@pretgemarket", "min_chars": 120 }`
  - `proof`: `{ "tweet_url": "...", "tweet_id": "..." }`

- **TELEGRAM_JOIN**
  - `quests.metadata`: `{ "chat_id": "@pretgemarket_community" }`
  - `proof`: `{ "telegram_user_id": "123456789", "telegram_username": "..." }`

- **REFERRAL**
  - `quests.metadata`: `{ "min_action": "REGISTERED" }` (MVP)
  - `proof`: `{ "referred_user_id": "uuid" }`

- **LINK_X / LINK_TELE**
  - `quests.metadata`: `{ "url": "https://..." }`
  - `proof`: `{ "click_token": "opaque" }`

---

## 6) Checklist vận hành

- Mỗi user có `invite_code` (unique). Set `referred_by_user_id` khi đăng ký qua link mời.
- Chỉ ghi `user_quests` khi **verify OK**. Trigger sẽ tự cộng điểm cho user & referrer (10%).
- Lịch sử thưởng ref lưu trong `referral_rewards` (who, which quest, how many).
- Bật rate-limit, yêu cầu `Idempotency-Key` để chống double-submit.
- Cron dọn pending (nếu dùng flow async), MVP hiện dùng verify sync nên không cần.

---

**Done.** Bạn có thể copy nguyên file này vào repo (ví dụ `docs/referral_erd_mvp.md`).  
Cần mình generate thêm **file .sql migration** gộp toàn bộ DDL trên không?

-- Quest System Migration
-- Based on MVP Point + Quest + Referral ERD

-- 1. Create enums
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

-- 2. Create quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_quests_code ON quests(code);

-- 3. Create user_quests table
CREATE TABLE user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_user_quests_submitted_at ON user_quests(submitted_at);

-- 4. Create user_points table
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Add referral columns to users table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='invite_code') THEN
    ALTER TABLE users
      ADD COLUMN invite_code VARCHAR(16),
      ADD COLUMN referred_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
      ADD CONSTRAINT chk_users_no_self_ref CHECK (referred_by_user_id IS NULL OR referred_by_user_id <> id);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_user_id);

-- 6. Create referral_rewards table
CREATE TABLE referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_ref_rewards_quest ON referral_rewards(quest_id);

-- 7. Create trigger function to handle points and referral rewards
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
AFTER INSERT OR UPDATE ON user_quests
FOR EACH ROW
WHEN (NEW.status = 'verified')
EXECUTE FUNCTION apply_points_on_verify();

-- 8. Insert sample quests for testing
INSERT INTO quests (code, title, description, type, status, points, metadata) VALUES
(
  'FOLLOW_X',
  'Follow us on X',
  'Follow @pretgemarket on X to stay updated with the latest news and announcements.',
  'SOCIAL_FOLLOW',
  'active',
  20,
  '{"handle": "@pretgemarket"}'::jsonb
),
(
  'JOIN_TELEGRAM',
  'Join Telegram Community',
  'Join our Telegram community for exclusive updates and discussions.',
  'TELEGRAM_JOIN',
  'active',
  30,
  '{"chat_id": "@pretgemarket_community"}'::jsonb
),
(
  'RETWEET_ANNOUNCEMENT',
  'Retweet Announcement',
  'Retweet our latest announcement to help spread the word.',
  'SOCIAL_RETWEET',
  'active',
  25,
  '{"tweet_id": "1234567890"}'::jsonb
),
(
  'POST_ABOUT_US',
  'Post about PreTGE',
  'Create a post about PreTGE with required hashtags and mention.',
  'SOCIAL_POST',
  'active',
  50,
  '{"required_tags": ["#PreTGE", "#DeFi"], "mention": "@pretgemarket", "min_chars": 120}'::jsonb
),
(
  'REFER_FRIEND',
  'Refer a Friend',
  'Invite a friend to join PreTGE using your referral code.',
  'REFERRAL',
  'active',
  100,
  '{"min_action": "REGISTERED"}'::jsonb
);

-- 9. Create function to generate invite codes for existing users
CREATE OR REPLACE FUNCTION generate_invite_codes()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  new_code VARCHAR(16);
  attempts INT;
BEGIN
  FOR user_record IN SELECT id FROM users WHERE invite_code IS NULL LOOP
    attempts := 0;
    LOOP
      new_code := upper(substr(md5(random()::text), 1, 8));
      
      -- Check if code already exists
      IF NOT EXISTS (SELECT 1 FROM users WHERE invite_code = new_code) THEN
        UPDATE users SET invite_code = new_code WHERE id = user_record.id;
        EXIT;
      END IF;
      
      attempts := attempts + 1;
      IF attempts > 10 THEN
        RAISE EXCEPTION 'Could not generate unique invite code for user %', user_record.id;
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate invite codes for existing users
SELECT generate_invite_codes();

-- 10. Create trigger to auto-generate invite code for new users
CREATE OR REPLACE FUNCTION generate_invite_code_on_insert()
RETURNS trigger AS $$
DECLARE
  new_code VARCHAR(16);
  attempts INT;
BEGIN
  IF NEW.invite_code IS NULL THEN
    attempts := 0;
    LOOP
      new_code := upper(substr(md5(random()::text), 1, 8));
      
      -- Check if code already exists
      IF NOT EXISTS (SELECT 1 FROM users WHERE invite_code = new_code) THEN
        NEW.invite_code := new_code;
        EXIT;
      END IF;
      
      attempts := attempts + 1;
      IF attempts > 10 THEN
        RAISE EXCEPTION 'Could not generate unique invite code';
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_invite_code_on_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION generate_invite_code_on_insert();

-- Migration complete
-- Quest system with referral rewards is now ready! 
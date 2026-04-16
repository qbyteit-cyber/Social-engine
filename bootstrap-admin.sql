-- Repurpose Engine — Bootstrap + Super Admin
-- Idempotent: safe to re-run. Paste into Supabase SQL editor.
--
-- What this does:
--   1. Creates all Phase 1 + Phase 3 tables if they don't exist
--   2. Adds an `is_admin` flag to users
--   3. Auto-promotes bratuandrei333@gmail.com to plan='agency' + is_admin=true
--      on every insert/update via trigger (so the Clerk webhook's default
--      'free' insert gets overridden immediately)
--   4. Also runs a one-shot UPDATE for any existing row

-- ─────────────────────────────────────────────────────────────
-- Phase 1 schema
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  brand_voice JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL,
  input_raw TEXT NOT NULL,
  extracted JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES content_jobs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft',
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES platform_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  posted_at TIMESTAMPTZ,
  platform_post_id TEXT,
  status TEXT DEFAULT 'queued',
  error TEXT
);

CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  platform_username TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- ─────────────────────────────────────────────────────────────
-- Phase 3 schema
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  invited_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE platform_variants
  ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS performance_fetched_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS brand_voice_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  original_text TEXT NOT NULL,
  edited_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS obsidian_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  vault_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- Usage view
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW user_monthly_usage AS
SELECT
  user_id,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS repurpose_count
FROM content_jobs
WHERE status != 'failed'
GROUP BY user_id, month;

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────

ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_variants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members          ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_samples   ENABLE ROW LEVEL SECURITY;
ALTER TABLE obsidian_tokens       ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- Super admin
-- ─────────────────────────────────────────────────────────────

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Trigger: any insert/update for bratuandrei333@gmail.com
-- is forced to plan='agency' + is_admin=true. Runs BEFORE the row is written,
-- so the Clerk webhook's default ('free') is overridden on first signup.
CREATE OR REPLACE FUNCTION auto_promote_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.email) = 'bratuandrei333@gmail.com' THEN
    NEW.plan := 'agency';
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_promote_super_admin ON users;
CREATE TRIGGER trg_auto_promote_super_admin
BEFORE INSERT OR UPDATE OF email, plan, is_admin ON users
FOR EACH ROW
EXECUTE FUNCTION auto_promote_super_admin();

-- Catch-up: if the user already exists, promote now.
UPDATE users
SET plan = 'agency', is_admin = true
WHERE LOWER(email) = 'bratuandrei333@gmail.com';

-- Verify
SELECT id, clerk_id, email, plan, is_admin, created_at
FROM users
WHERE LOWER(email) = 'bratuandrei333@gmail.com';

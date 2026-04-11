-- Repurpose Engine — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL editor

-- Users synced from Clerk
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'free', -- free | creator | agency
  brand_voice JSONB,        -- tone, style, keywords, examples
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content jobs (one per repurpose request)
CREATE TABLE content_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL,      -- url | text | doc
  input_raw TEXT NOT NULL,       -- original content
  extracted JSONB,               -- title, body, key_points, tone
  status TEXT DEFAULT 'pending', -- pending | generating | ready | failed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Platform variants (10 per job)
CREATE TABLE platform_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES content_jobs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,        -- linkedin | twitter | instagram | etc.
  content JSONB NOT NULL,        -- { text, hashtags, thread_parts?, media_suggestions? }
  status TEXT DEFAULT 'draft',   -- draft | approved | scheduled | published | failed
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scheduled posts queue
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES platform_variants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  posted_at TIMESTAMPTZ,
  platform_post_id TEXT,         -- ID returned by platform after posting
  status TEXT DEFAULT 'queued',  -- queued | posted | failed
  error TEXT
);

-- Platform OAuth connections
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL,    -- encrypt at rest (AES-256)
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  platform_username TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

-- Usage tracking view (per month)
CREATE OR REPLACE VIEW user_monthly_usage AS
SELECT
  user_id,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS repurpose_count
FROM content_jobs
WHERE status != 'failed'
GROUP BY user_id, month;

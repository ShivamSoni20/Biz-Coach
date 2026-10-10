-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table (stores the Biz Coach conversation state)
CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  business_type TEXT NOT NULL CHECK (business_type IN ('agency','freelancer','consultant','startup')),
  business_name TEXT,
  messages      JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_answered INT NOT NULL DEFAULT 0,
  extracted_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
  status        TEXT NOT NULL DEFAULT 'coaching'
                CHECK (status IN ('onboarding','coaching','generating','complete')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Brains table (stores the generated Company Brain output)
CREATE TABLE IF NOT EXISTS brains (
  id               TEXT PRIMARY KEY,
  business_name    TEXT NOT NULL,
  business_type    TEXT NOT NULL,
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_duration INT NOT NULL DEFAULT 0,
  knowledge        JSONB NOT NULL DEFAULT '{}'::jsonb,
  processes        JSONB NOT NULL DEFAULT '[]'::jsonb,
  judgment         JSONB NOT NULL DEFAULT '{}'::jsonb,
  skills           JSONB NOT NULL DEFAULT '[]'::jsonb,
  knowledge_md     TEXT NOT NULL DEFAULT '',
  processes_md     TEXT NOT NULL DEFAULT '',
  judgment_md      TEXT NOT NULL DEFAULT '',
  view_count       INT NOT NULL DEFAULT 0,
  expires_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- Auto-update updated_at on sessions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_brains_expires   ON brains(expires_at);
CREATE INDEX IF NOT EXISTS idx_brains_business  ON brains(business_name);

-- Row-level security (public read for brains, server-only writes)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brains   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_sessions"
  ON sessions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "public_read_brains"
  ON brains FOR SELECT USING (true);

CREATE POLICY "service_role_write_brains"
  ON brains FOR INSERT WITH CHECK (true);

CREATE POLICY "service_role_update_brains"
  ON brains FOR UPDATE USING (true);

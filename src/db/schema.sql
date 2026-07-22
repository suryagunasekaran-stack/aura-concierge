-- Aura concierge MVP schema (intent logging + knowledge training)

CREATE TABLE IF NOT EXISTS intent_events (
  id            BIGSERIAL PRIMARY KEY,
  session_id    TEXT NOT NULL,
  user_text     TEXT NOT NULL,
  intent        TEXT NOT NULL,
  confidence    REAL,
  tool_calls    JSONB NOT NULL DEFAULT '[]'::jsonb,
  reply_preview TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS intent_events_created_at_idx
  ON intent_events (created_at DESC);

CREATE INDEX IF NOT EXISTS intent_events_intent_idx
  ON intent_events (intent);

CREATE TABLE IF NOT EXISTS training_documents (
  id          BIGSERIAL PRIMARY KEY,
  filename    TEXT NOT NULL,
  content     TEXT NOT NULL,
  byte_size   INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS training_documents_created_at_idx
  ON training_documents (created_at DESC);

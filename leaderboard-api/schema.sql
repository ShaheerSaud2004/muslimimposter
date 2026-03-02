-- Run this once on your DigitalOcean Postgres database
-- (e.g. connect with psql or DO console and run the file)

CREATE TABLE IF NOT EXISTS leaderboard (
  device_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  rounds_played INT NOT NULL DEFAULT 0,
  rounds_won INT NOT NULL DEFAULT 0,
  imposter_wins INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rounds_won ON leaderboard (rounds_won DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_last_updated ON leaderboard (last_updated DESC);

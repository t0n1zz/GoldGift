-- GoldGift database schema for Supabase (PostgreSQL)
-- Run this in Supabase SQL Editor to create tables and views

CREATE TABLE gifts (
  id TEXT PRIMARY KEY,
  sender_wallet TEXT NOT NULL,
  recipient_wallet TEXT,
  amount_usd DECIMAL(10, 2) NOT NULL,
  amount_gold DECIMAL(18, 8) NOT NULL,
  occasion TEXT NOT NULL CHECK (occasion IN ('birthday', 'wedding', 'graduation', 'thankyou')),
  message TEXT,
  image_url TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  escrow_account TEXT,
  transaction_signature TEXT,
  claim_transaction_signature TEXT
);

-- Indexes for fast queries
CREATE INDEX idx_gifts_sender_wallet ON gifts(sender_wallet);
CREATE INDEX idx_gifts_claimed ON gifts(claimed);
CREATE INDEX idx_gifts_created_at ON gifts(created_at DESC);
CREATE INDEX idx_gifts_occasion ON gifts(occasion);

-- Analytics view: aggregate stats
CREATE OR REPLACE VIEW gift_stats AS
SELECT
  COUNT(*) AS total_gifts,
  COUNT(*) FILTER (WHERE claimed = TRUE) AS claimed_gifts,
  COUNT(*) FILTER (WHERE claimed = FALSE) AS unclaimed_gifts,
  COALESCE(SUM(amount_usd), 0) AS total_usd_value,
  COALESCE(SUM(amount_gold), 0) AS total_gold_amount,
  COALESCE(SUM(amount_usd) FILTER (WHERE claimed = TRUE), 0) AS claimed_usd_value
FROM gifts;

-- Analytics view: daily stats
CREATE OR REPLACE VIEW daily_gift_stats AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS gifts_created,
  COUNT(*) FILTER (WHERE claimed = TRUE) AS gifts_claimed,
  SUM(amount_usd) AS usd_volume,
  SUM(amount_gold) AS gold_volume
FROM gifts
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- Enable RLS (Row Level Security) if you want per-user isolation
-- ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
-- Create policies as needed for your auth model

-- If you are updating an existing project, run:
--   ALTER TABLE gifts ADD COLUMN image_url TEXT;

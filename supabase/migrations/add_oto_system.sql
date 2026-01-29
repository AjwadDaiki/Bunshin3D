-- OTO (One-Time Offer) system
-- Tracks when a user first hits 0 credits to trigger a 24h special offer

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS special_offer_started_at TIMESTAMPTZ DEFAULT NULL;

-- Function: automatically trigger OTO when credits reach 0 for the first time
CREATE OR REPLACE FUNCTION trigger_special_offer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.credits = 0
    AND (OLD.credits IS NULL OR OLD.credits > 0)
    AND NEW.special_offer_started_at IS NULL
  THEN
    NEW.special_offer_started_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on profile update (credits decrement)
DROP TRIGGER IF EXISTS trg_special_offer ON profiles;
CREATE TRIGGER trg_special_offer
  BEFORE UPDATE OF credits ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_special_offer();

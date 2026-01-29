-- Fix: Limit referral bonus to first payment only
-- Adds a flag to track whether the referral reward has been paid

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS referral_reward_paid BOOLEAN DEFAULT false;

-- Add index for quick lookup during webhook processing
CREATE INDEX IF NOT EXISTS idx_profiles_referral_reward
ON profiles (id, referred_by, referral_reward_paid)
WHERE referred_by IS NOT NULL;

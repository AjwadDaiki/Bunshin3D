-- ============================================================
-- MIGRATION COMPLÈTE : Parrainage + Déduplication + OTO
-- Exécuter une seule fois sur Supabase (SQL Editor)
-- ============================================================

-- ========================
-- 1. EXTENSION REQUISE
-- ========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================
-- 2. COLONNES PARRAINAGE
-- ========================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_credits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

-- Contrainte unique sur referral_code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_referral_code_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
  END IF;
END;
$$;

-- FK referred_by -> profiles.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_referred_by_fkey'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_referred_by_fkey
      FOREIGN KEY (referred_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);

-- ========================
-- 3. FONCTIONS PARRAINAGE
-- ========================

-- Génère un code parrainage unique (10 caractères hex)
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  LOOP
    code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code);
  END LOOP;
  RETURN code;
END;
$$;

-- Trigger : attribue un code parrainage à chaque nouvel utilisateur
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR length(NEW.referral_code) = 0 THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_referral_code ON profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

-- Attribue un code aux utilisateurs existants qui n'en ont pas
UPDATE profiles
SET referral_code = generate_referral_code()
WHERE referral_code IS NULL OR referral_code = '';

-- Incrémente les crédits de parrainage d'un utilisateur
CREATE OR REPLACE FUNCTION increment_referral_credits(amount INTEGER, target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET referral_credits = referral_credits + amount,
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

-- ========================
-- 4. DÉDUPLICATION PARRAINAGE (bonus +10 au 1er paiement uniquement)
-- ========================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_reward_paid BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_reward
  ON profiles (id, referred_by, referral_reward_paid)
  WHERE referred_by IS NOT NULL;

-- ========================
-- 5. SYSTÈME OTO (One-Time Offer 24h)
-- ========================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS special_offer_started_at TIMESTAMPTZ DEFAULT NULL;

-- Trigger : quand les crédits tombent à 0 pour la première fois, active l'offre
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

DROP TRIGGER IF EXISTS trg_special_offer ON profiles;
CREATE TRIGGER trg_special_offer
  BEFORE UPDATE OF credits ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_special_offer();

-- 1. Ajouter la colonne updated_at si elle n'existe pas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Créer/recréer les fonctions avec ordre alphabétique
CREATE OR REPLACE FUNCTION decrement_credits(amount integer, target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION increment_credits(amount integer, target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = NOW()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

-- 3. Vérifier que la table generations a les bonnes colonnes
ALTER TABLE generations
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS prediction_id TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'processing';

-- 4. Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_prediction_id ON generations(prediction_id);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

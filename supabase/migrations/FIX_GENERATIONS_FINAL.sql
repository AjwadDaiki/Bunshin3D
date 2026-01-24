-- ================================================
-- FIX COMPLET GENERATIONS - EXÉCUTER DANS SUPABASE
-- ================================================

-- 1. S'assurer que la table existe avec toutes les colonnes
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'processing',
  prediction_id TEXT,
  type TEXT,
  output TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ajouter les colonnes manquantes (si la table existe déjà)
DO $$
BEGIN
  -- Ajouter output si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'output'
  ) THEN
    ALTER TABLE generations ADD COLUMN output TEXT;
  END IF;

  -- Ajouter prediction_id si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'prediction_id'
  ) THEN
    ALTER TABLE generations ADD COLUMN prediction_id TEXT;
  END IF;

  -- Ajouter type si manquant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'type'
  ) THEN
    ALTER TABLE generations ADD COLUMN type TEXT;
  END IF;
END $$;

-- 3. Créer les index
CREATE INDEX IF NOT EXISTS idx_generations_prediction_id ON generations(prediction_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- 4. Désactiver RLS temporairement pour vérifier que ce n'est pas le problème
ALTER TABLE generations DISABLE ROW LEVEL SECURITY;

-- 5. Activer Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE generations;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 6. Credit functions (au cas où pas encore fait)
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
END;
$$;

-- 7. Ajouter updated_at à profiles si manquant
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 8. Vérification finale
SELECT 'GENERATIONS TABLE:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'generations'
ORDER BY ordinal_position;

SELECT 'RECENT GENERATIONS:' as info;
SELECT id, user_id, status, prediction_id, type,
       CASE WHEN output IS NULL THEN 'NULL' ELSE 'HAS DATA' END as output_status,
       created_at
FROM generations
ORDER BY created_at DESC
LIMIT 5;

SELECT 'REALTIME STATUS:' as info;
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

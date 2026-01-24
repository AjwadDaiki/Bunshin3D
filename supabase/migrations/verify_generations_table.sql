-- ================================================
-- VERIFICATION ET FIX TABLE GENERATIONS
-- Exécuter dans Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Vérifier la structure actuelle
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'generations'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ajouter les colonnes manquantes si nécessaire
ALTER TABLE generations ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'processing';
ALTER TABLE generations ADD COLUMN IF NOT EXISTS prediction_id TEXT;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS output TEXT;
ALTER TABLE generations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Créer un index sur prediction_id pour les lookups rapides
CREATE INDEX IF NOT EXISTS idx_generations_prediction_id ON generations(prediction_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);

-- 4. Activer Realtime pour les generations
ALTER PUBLICATION supabase_realtime ADD TABLE generations;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- 5. Vérifier les RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'generations'
ORDER BY policyname;

-- 6. S'assurer que RLS est activé mais avec les bonnes policies
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Recréer les policies
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON generations;
DROP POLICY IF EXISTS "Users can update own generations" ON generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
DROP POLICY IF EXISTS "Service role has full access" ON generations;

-- Policy pour SELECT
CREATE POLICY "Users can view own generations"
ON generations FOR SELECT
USING (auth.uid() = user_id);

-- Policy pour INSERT (important: vérifier user_id)
CREATE POLICY "Users can insert own generations"
ON generations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy pour UPDATE
CREATE POLICY "Users can update own generations"
ON generations FOR UPDATE
USING (auth.uid() = user_id);

-- Policy pour DELETE
CREATE POLICY "Users can delete own generations"
ON generations FOR DELETE
USING (auth.uid() = user_id);

-- 7. Vérifier après les modifications
SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'generations'
ORDER BY ordinal_position;

-- 8. Afficher les générations existantes (debug)
SELECT id, user_id, status, prediction_id, type,
       LEFT(output, 100) as output_preview,
       created_at
FROM generations
ORDER BY created_at DESC
LIMIT 10;

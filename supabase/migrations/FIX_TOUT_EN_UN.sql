-- ================================================
-- FIX COMPLET BUNSHIN3D - EXÉCUTER DANS SUPABASE
-- Supabase Dashboard > SQL Editor > New Query > Coller > Run
-- ================================================

-- ============================================
-- PARTIE 1: COLONNE MANQUANTE (profiles)
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- PARTIE 2: FONCTIONS CREDITS (ordre alphabétique)
-- ============================================
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

-- ============================================
-- PARTIE 3: RLS POLICIES - GENERATIONS TABLE
-- ============================================

-- Enable RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON generations;
DROP POLICY IF EXISTS "Users can update own generations" ON generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
DROP POLICY IF EXISTS "Service role full access generations" ON generations;

-- SELECT: Users can view their own generations
CREATE POLICY "Users can view own generations"
ON generations FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Users can insert their own generations
CREATE POLICY "Users can insert own generations"
ON generations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own generations
CREATE POLICY "Users can update own generations"
ON generations FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own generations
CREATE POLICY "Users can delete own generations"
ON generations FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- PARTIE 4: RLS POLICIES - PROFILES TABLE
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- SELECT: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- INSERT: Users can create their own profile (for new signups)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- PARTIE 5: VÉRIFICATION
-- ============================================

-- Afficher les politiques créées
SELECT
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename IN ('generations', 'profiles')
ORDER BY tablename, policyname;

-- Afficher les fonctions de crédits
SELECT
  routine_name,
  string_agg(parameter_name || ' ' || data_type, ', ' ORDER BY ordinal_position) as params
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p ON r.specific_name = p.specific_name
WHERE routine_schema = 'public'
  AND routine_name IN ('decrement_credits', 'increment_credits')
GROUP BY routine_name;

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- Politiques créées:
-- generations | Users can delete own generations | PERMISSIVE | DELETE
-- generations | Users can insert own generations | PERMISSIVE | INSERT
-- generations | Users can update own generations | PERMISSIVE | UPDATE
-- generations | Users can view own generations   | PERMISSIVE | SELECT
-- profiles    | Users can insert own profile     | PERMISSIVE | INSERT
-- profiles    | Users can update own profile     | PERMISSIVE | UPDATE
-- profiles    | Users can view own profile       | PERMISSIVE | SELECT
--
-- Fonctions:
-- decrement_credits | amount integer, target_user_id uuid
-- increment_credits | amount integer, target_user_id uuid

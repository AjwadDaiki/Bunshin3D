-- 🔍 DIAGNOSTIC COMPLET - Système de crédits

-- ===============================================
-- 1. VÉRIFIER QUE LA TABLE PROFILES EXISTE
-- ===============================================
SELECT
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'profiles';

-- ✅ Résultat attendu : 1 ligne avec table_name='profiles'


-- ===============================================
-- 2. VÉRIFIER LES COLONNES DE LA TABLE PROFILES
-- ===============================================
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ✅ Doit contenir au minimum : id, email, credits, updated_at


-- ===============================================
-- 3. VÉRIFIER QUE LES FONCTIONS EXISTENT
-- ===============================================
SELECT
  routine_name,
  routine_schema,
  data_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('decrement_credits', 'increment_credits');

-- ✅ Résultat attendu : 2 lignes
-- security_type DOIT être 'DEFINER' (pas 'INVOKER')


-- ===============================================
-- 4. VOIR LE CODE SOURCE DES FONCTIONS
-- ===============================================
SELECT
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('decrement_credits', 'increment_credits');

-- ✅ Vérifier que le code contient bien "SECURITY DEFINER"


-- ===============================================
-- 5. LISTER QUELQUES UTILISATEURS AVEC LEURS CRÉDITS
-- ===============================================
SELECT
  id,
  email,
  credits,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- ✅ Vérifier que vous voyez votre compte et que credits est un nombre


-- ===============================================
-- 6. TESTER LA FONCTION MANUELLEMENT
-- ===============================================
-- REMPLACEZ 'VOTRE-USER-ID-ICI' par votre vrai UUID
-- Vous pouvez le trouver dans le résultat de la requête #5 ci-dessus

-- D'abord, vérifier les crédits actuels
SELECT id, email, credits
FROM profiles
WHERE email = 'matteo.biyikli3224@gmail.com'
   OR email = 'Daiki.ajwad@gmail.com';

-- Ensuite, tester decrement_credits
-- ⚠️ REMPLACEZ l'UUID ci-dessous par le vôtre !
SELECT decrement_credits('VOTRE-USER-ID-ICI'::uuid, 1);

-- Vérifier que ça a fonctionné
SELECT id, email, credits, updated_at
FROM profiles
WHERE email = 'matteo.biyikli3224@gmail.com'
   OR email = 'Daiki.ajwad@gmail.com';

-- Le nombre de crédits devrait avoir diminué de 1
-- Si ça fonctionne ici, le problème est ailleurs


-- ===============================================
-- 7. REDONNER DES CRÉDITS POUR ANNULER LE TEST
-- ===============================================
-- Si le test #6 a fonctionné, redonnez-vous le crédit
SELECT increment_credits('VOTRE-USER-ID-ICI'::uuid, 1);


-- ===============================================
-- 8. VÉRIFIER LES PERMISSIONS RLS (Row Level Security)
-- ===============================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Vérifier qu'il n'y a pas de politique bloquant les updates


-- ===============================================
-- 9. RECRÉER LES FONCTIONS AVEC PLUS DE LOGS
-- ===============================================
-- Version avec logs pour debugger

CREATE OR REPLACE FUNCTION decrement_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  rows_affected integer;
BEGIN
  -- Log 1: Fonction appelée
  RAISE NOTICE 'decrement_credits called: user_id=%, amount=%', target_user_id, amount;

  -- Vérifier que l'utilisateur existe
  SELECT credits INTO current_credits
  FROM profiles
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found in profiles table', target_user_id;
  END IF;

  -- Log 2: Crédits actuels
  RAISE NOTICE 'Current credits: %', current_credits;

  -- Effectuer la mise à jour
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
  WHERE id = target_user_id;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;

  -- Log 3: Résultat
  RAISE NOTICE 'Rows affected: %', rows_affected;

  IF rows_affected = 0 THEN
    RAISE EXCEPTION 'Failed to update credits for user %', target_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION increment_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected integer;
BEGIN
  RAISE NOTICE 'increment_credits called: user_id=%, amount=%', target_user_id, amount;

  UPDATE profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = target_user_id;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RAISE NOTICE 'Rows affected: %', rows_affected;

  IF rows_affected = 0 THEN
    RAISE EXCEPTION 'Failed to increment credits for user %', target_user_id;
  END IF;
END;
$$;

-- ✅ Ces versions afficheront des messages dans les logs Supabase


-- ===============================================
-- 10. TESTER À NOUVEAU AVEC LES NOUVELLES FONCTIONS
-- ===============================================
SELECT decrement_credits('VOTRE-USER-ID-ICI'::uuid, 1);
-- Regardez les logs dans Supabase Dashboard > Logs


-- ===============================================
-- RÉSUMÉ DES VÉRIFICATIONS
-- ===============================================
-- ✅ Table profiles existe
-- ✅ Colonne credits existe (type: integer ou numeric)
-- ✅ Fonctions decrement_credits et increment_credits existent
-- ✅ Fonctions ont SECURITY DEFINER (pas INVOKER)
-- ✅ Vous pouvez voir votre profil avec des crédits
-- ✅ Test manuel de decrement_credits fonctionne
-- ✅ Aucune politique RLS ne bloque les updates

-- Si TOUTES ces vérifications passent mais l'API échoue encore,
-- le problème est dans l'API route ou dans l'appel depuis le front.

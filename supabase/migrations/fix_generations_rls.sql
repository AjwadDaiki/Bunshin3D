-- ================================================
-- FIX GENERATIONS RLS POLICIES
-- Execute in Supabase Dashboard > SQL Editor
-- ================================================

-- 1. Enable RLS on generations table (if not already enabled)
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (clean slate)
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON generations;
DROP POLICY IF EXISTS "Users can update own generations" ON generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
DROP POLICY IF EXISTS "Service role can do anything" ON generations;

-- 3. Create SELECT policy - users can view their own generations
CREATE POLICY "Users can view own generations"
ON generations FOR SELECT
USING (auth.uid() = user_id);

-- 4. Create INSERT policy - users can insert their own generations
CREATE POLICY "Users can insert own generations"
ON generations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Create UPDATE policy - users can update their own generations
CREATE POLICY "Users can update own generations"
ON generations FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Create DELETE policy - users can delete their own generations
CREATE POLICY "Users can delete own generations"
ON generations FOR DELETE
USING (auth.uid() = user_id);

-- 7. Also ensure profiles table has proper RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 8. Verify policies are created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('generations', 'profiles')
ORDER BY tablename, policyname;

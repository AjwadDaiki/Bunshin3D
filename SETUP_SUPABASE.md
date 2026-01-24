# 🔧 Configuration Supabase - Instructions

## ⚠️ IMPORTANT - À exécuter dans l'ordre

### 1. Créer le bucket Storage "uploads"

**Via l'interface Supabase :**
1. Aller sur https://supabase.com/dashboard/project/xeeosyzokwlyxggnzbjh
2. Cliquer sur **Storage** dans le menu gauche
3. Cliquer sur **New bucket**
4. Nom du bucket : `uploads`
5. **Cocher "Public bucket"** ✅
6. Cliquer sur **Create bucket**

**OU via SQL (dans SQL Editor) :**

```sql
-- Créer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'uploads';
```

---

### 2. Appliquer les politiques RLS sur le bucket

**Dans SQL Editor, exécuter :**

```sql
-- Politique : Permettre les uploads aux utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique : Lecture publique
CREATE POLICY IF NOT EXISTS "Public can read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Politique : Suppression par le propriétaire
CREATE POLICY IF NOT EXISTS "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

### 3. Créer les fonctions de gestion des crédits

**Dans SQL Editor, exécuter :**

```sql
-- Fonction pour décrémenter les crédits
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Fonction pour incrémenter les crédits (remboursement en cas d'erreur)
CREATE OR REPLACE FUNCTION increment_credits(target_user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Vérifier que les fonctions existent
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('decrement_credits', 'increment_credits');
```

---

### 4. Ajouter la colonne 'type' à la table generations

**Dans SQL Editor, exécuter :**

```sql
-- Ajouter la colonne 'type' si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'type'
  ) THEN
    ALTER TABLE generations ADD COLUMN type text DEFAULT 'standard';
  END IF;
END $$;

-- Vérifier la colonne
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'generations' AND column_name = 'type';
```

---

### 5. Vérifier que tout fonctionne

**Test 1 : Bucket existe**
```sql
SELECT * FROM storage.buckets WHERE id = 'uploads';
-- Résultat attendu : 1 ligne avec id='uploads', public=true
```

**Test 2 : Politiques RLS actives**
```sql
SELECT policyname
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
-- Résultat attendu : Au moins 3 politiques
```

**Test 3 : Fonctions créées**
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('decrement_credits', 'increment_credits');
-- Résultat attendu : 2 lignes
```

**Test 4 : Colonne type existe**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'generations' AND column_name = 'type';
-- Résultat attendu : 1 ligne
```

---

## ✅ Résultat attendu

Après avoir exécuté toutes ces étapes, vous devriez avoir :

- ✅ Bucket `uploads` créé et public
- ✅ 3 politiques RLS sur le bucket
- ✅ Fonction `decrement_credits` créée
- ✅ Fonction `increment_credits` créée
- ✅ Colonne `type` dans la table `generations`

---

## 🐛 Résolution des problèmes

### Erreur "Bucket not found"
➡️ Le bucket n'existe pas. Exécutez l'étape 1.

### Erreur "Failed to deduct credits"
➡️ La fonction SQL n'existe pas. Exécutez l'étape 3.

### Erreur "permission denied for table profiles"
➡️ Les fonctions doivent avoir `SECURITY DEFINER`. Exécutez à nouveau l'étape 3.

### Upload échoue avec "Policy violation"
➡️ Les politiques RLS ne sont pas configurées. Exécutez l'étape 2.

---

## 📝 Notes importantes

- Ces scripts sont idempotents (peuvent être exécutés plusieurs fois sans erreur)
- Utilisez le **SQL Editor** de Supabase Dashboard pour exécuter ces commandes
- Les fonctions avec `SECURITY DEFINER` s'exécutent avec les privilèges du créateur (bypass RLS)
- Le bucket `uploads` doit être **public** pour que les images soient accessibles via URL

---

## 🔗 Liens utiles

- Supabase Dashboard : https://supabase.com/dashboard/project/xeeosyzokwlyxggnzbjh
- SQL Editor : https://supabase.com/dashboard/project/xeeosyzokwlyxggnzbjh/sql
- Storage : https://supabase.com/dashboard/project/xeeosyzokwlyxggnzbjh/storage/buckets

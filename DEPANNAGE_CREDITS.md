# 🔧 Dépannage - Erreur "Failed to deduct credits"

## 🚨 Étapes de diagnostic (dans l'ordre)

### Étape 1 : Vérifier que la fonction existe

Dans **Supabase SQL Editor**, exécutez :

```sql
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'decrement_credits';
```

**Résultat attendu :**
```
routine_name        | security_type
--------------------|---------------
decrement_credits   | DEFINER
```

**Si ça ne retourne rien** → La fonction n'existe pas, passez à l'étape 2.
**Si security_type = "INVOKER"** → Mauvaise configuration, passez à l'étape 2.
**Si tout est OK** → Passez à l'étape 3.

---

### Étape 2 : Créer les fonctions avec logs

Exécutez ce script dans **Supabase SQL Editor** :

```sql
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
  -- Vérifier que l'utilisateur existe
  SELECT credits INTO current_credits
  FROM profiles
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found in profiles table', target_user_id;
  END IF;

  -- Effectuer la mise à jour
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
  WHERE id = target_user_id;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;

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
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Vérifier que ça a marché
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_name IN ('decrement_credits', 'increment_credits');
```

**Résultat attendu :** 2 lignes avec security_type = "DEFINER"

---

### Étape 3 : Tester manuellement la fonction

**3A. Trouvez votre User ID**

```sql
SELECT id, email, credits
FROM profiles
WHERE email = 'matteo.biyikli3224@gmail.com'
   OR email = 'Daiki.ajwad@gmail.com';
```

**Notez votre `id` (c'est un UUID comme `12345678-1234-...`).**

**3B. Testez decrement_credits**

```sql
-- Remplacez VOTRE-UUID-ICI par votre vrai UUID
SELECT decrement_credits('VOTRE-UUID-ICI'::uuid, 1);
```

**3C. Vérifiez que ça a fonctionné**

```sql
SELECT id, email, credits, updated_at
FROM profiles
WHERE id = 'VOTRE-UUID-ICI'::uuid;
```

**Le nombre de crédits devrait avoir diminué de 1.**

**Si ça fonctionne :** Passez à l'étape 4.
**Si ça ne fonctionne pas :** Il y a un problème avec votre table `profiles` → contactez-moi avec l'erreur exacte.

**3D. Redonnez-vous le crédit**

```sql
SELECT increment_credits('VOTRE-UUID-ICI'::uuid, 1);
```

---

### Étape 4 : Vérifier les logs de l'API

Maintenant que les fonctions SQL fonctionnent, testez depuis le site :

1. Ouvrez **Chrome DevTools** (F12)
2. Allez dans l'onglet **Console**
3. Essayez de générer un modèle 3D
4. Regardez les logs dans la console

**Vous devriez voir :**
```
📊 User abc123... has 10 credits
💳 Calling decrement_credits for user abc123...
✅ 1 credit deducted from user abc123...
```

**Si vous voyez une erreur** → Copiez-moi l'erreur complète.

---

### Étape 5 : Vérifier les logs Supabase (si toujours un problème)

1. Allez sur : https://supabase.com/dashboard/project/xeeosyzokwlyxggnzbjh/logs/edge-logs
2. Filtrez par "API Logs"
3. Cherchez les lignes avec `decrement_credits`

**Regardez s'il y a des erreurs PostgreSQL.**

---

## 🔍 Erreurs courantes et solutions

### Erreur : "function decrement_credits does not exist"

**Cause :** La fonction n'est pas créée.

**Solution :** Exécutez l'étape 2 ci-dessus.

---

### Erreur : "permission denied for function decrement_credits"

**Cause :** La fonction n'a pas `SECURITY DEFINER`.

**Solution :** Recréez la fonction avec l'étape 2 (elle inclut `SECURITY DEFINER`).

---

### Erreur : "User xyz not found in profiles table"

**Cause :** Le `userId` passé depuis le front n'existe pas dans la table `profiles`.

**Solution :** Vérifiez que l'utilisateur est bien connecté et que son ID est correct.

```sql
-- Vérifier que l'utilisateur existe
SELECT id, email FROM profiles WHERE id = 'VOTRE-UUID'::uuid;
```

Si l'utilisateur n'existe pas, il faut le créer :

```sql
INSERT INTO profiles (id, email, credits, created_at, updated_at)
VALUES ('VOTRE-UUID'::uuid, 'votre@email.com', 10, now(), now());
```

---

### Erreur : "column credits does not exist"

**Cause :** La table `profiles` n'a pas de colonne `credits`.

**Solution :** Ajoutez la colonne :

```sql
ALTER TABLE profiles ADD COLUMN credits integer DEFAULT 0;
```

---

### Erreur : "insufficient_privilege"

**Cause :** Les politiques RLS bloquent les updates.

**Solution :** Vérifiez les politiques :

```sql
SELECT policyname, cmd, with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

Si nécessaire, créez une politique permettant les updates :

```sql
CREATE POLICY "Allow service role to update profiles"
ON profiles FOR UPDATE
TO service_role
USING (true);
```

---

## 📝 Checklist finale

Avant de me contacter, vérifiez que :

- [ ] ✅ La fonction `decrement_credits` existe (Étape 1)
- [ ] ✅ La fonction a `SECURITY DEFINER` (Étape 1)
- [ ] ✅ Le test manuel fonctionne (Étape 3)
- [ ] ✅ Votre compte a des crédits (`SELECT credits FROM profiles WHERE ...`)
- [ ] ✅ L'API route utilise bien `SUPABASE_SERVICE_ROLE_KEY` (pas `SUPABASE_ANON_KEY`)
- [ ] ✅ Le `userId` est un UUID valide (pas `null` ou `undefined`)
- [ ] ✅ La table `profiles` a une colonne `credits` de type `integer`

---

## 🆘 Si rien ne marche

Envoyez-moi :

1. **Le résultat de cette requête :**
```sql
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_name = 'decrement_credits';
```

2. **Le résultat de cette requête :**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'credits';
```

3. **Les logs de la console Chrome** quand vous essayez de générer un modèle

4. **L'erreur exacte** que vous voyez dans l'interface

---

## ✅ J'ai également ajouté plus de logs

Les fichiers suivants ont été mis à jour avec des logs détaillés :

- `app/api/text-to-3d/generate-model/route.ts`
- `app/api/premium-3d/create/route.ts`

Maintenant quand il y a une erreur, vous verrez exactement :
- Le message d'erreur PostgreSQL
- Les détails de l'erreur
- Le code d'erreur
- Les hints de PostgreSQL

**Testez à nouveau et regardez les logs Chrome Console !**

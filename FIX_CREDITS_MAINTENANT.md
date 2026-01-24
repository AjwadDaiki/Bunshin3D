# 🚨 FIX URGENT - Corriger l'Erreur de Crédits

## Le Problème

Erreur actuelle : `Failed to deduct credits: Could not find the function public.decrement_credits(amount, target_user_id)`

**Cause** : La fonction SQL a les paramètres dans le mauvais ordre à cause de Supabase JS qui réordonne alphabétiquement.

---

## 🔧 Solution en 3 Étapes (5 minutes)

### Étape 1 : Copier le SQL

Ouvrir le fichier : `supabase/migrations/fix_credits_function_order.sql`

**OU** copier ce code :

```sql
CREATE OR REPLACE FUNCTION decrement_credits(amount integer, target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - amount, 0),
      updated_at = now()
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
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', target_user_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION decrement_credits IS 'Décrémenter les crédits (ordre alphabétique pour Supabase JS)';
COMMENT ON FUNCTION increment_credits IS 'Incrémenter les crédits (ordre alphabétique pour Supabase JS)';
```

### Étape 2 : Aller dans Supabase Dashboard

1. Ouvrir https://supabase.com/dashboard/project/_
2. Cliquer sur **SQL Editor** dans le menu à gauche
3. Cliquer sur **New query**

### Étape 3 : Exécuter le SQL

1. Coller le code SQL copié à l'étape 1
2. Cliquer sur **Run** (ou appuyer sur `Ctrl+Enter`)
3. Attendre le message de succès ✅

---

## ✅ Vérification

Après l'exécution, tester **toutes les combinaisons** :

### Test 1 : Text-to-3D Standard (1 crédit)
1. Aller sur `/studio`
2. Cliquer sur **"Texte vers 3D"**
3. Sélectionner **"Standard"** (1 crédit)
4. Entrer : "Un robot futuriste debout sur une plateforme"
5. Cliquer **"Générer depuis le Texte"**
6. **Vérifier** : 1 crédit déduit, image générée, puis modèle 3D créé

### Test 2 : Text-to-3D Premium (5 crédits)
1. Même chose mais avec **"Premium"** (5 crédits)
2. **Vérifier** : 5 crédits déduits

### Test 3 : Image-to-3D Standard (1 crédit)
1. Cliquer sur **"Image vers 3D"**
2. Sélectionner **"Standard"** (1 crédit)
3. Upload une image
4. Cliquer **"GÉNÉRER MODÈLE 3D"**
5. **Vérifier** : 1 crédit déduit

### Test 4 : Image-to-3D Premium (5 crédits)
1. Même chose avec **"Premium"** (5 crédits)
2. **Vérifier** : 5 crédits déduits

---

## 📊 Ce qui va changer

### Avant ❌
```
Erreur : Could not find the function public.decrement_credits(amount, target_user_id)
```

### Après ✅
```
✅ 1 credit deducted from user {userId}
✅ 5 credits deducted from user {userId}
```

---

## 🎯 Récapitulatif

| Génération | Qualité | Crédits | API |
|-----------|---------|---------|-----|
| Text → 3D | Standard | 1 | `/api/text-to-3d/*` |
| Text → 3D | Premium | 5 | `/api/premium-3d/create` |
| Image → 3D | Standard | 1 | `/api/text-to-3d/generate-model` |
| Image → 3D | Premium | 5 | `/api/premium-3d/create` |

**Tous les workflows utiliseront maintenant la fonction SQL corrigée.**

---

## ❓ Si ça ne marche toujours pas

Vérifier dans les logs Supabase que la fonction a bien été recréée :

```sql
SELECT
  routine_name,
  string_agg(parameter_name || ' ' || data_type, ', ' ORDER BY ordinal_position) as params
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p ON r.specific_name = p.specific_name
WHERE routine_schema = 'public'
  AND routine_name IN ('decrement_credits', 'increment_credits')
GROUP BY routine_name;
```

**Résultat attendu** :
```
decrement_credits | amount integer, target_user_id uuid
increment_credits | amount integer, target_user_id uuid
```

Si les paramètres sont dans le bon ordre (alphabétique), c'est OK ! ✅

---

**Fichier SQL** : `supabase/migrations/fix_credits_function_order.sql`
**Documentation complète** : `ARCHITECTURE_3D_GENERATION.md`

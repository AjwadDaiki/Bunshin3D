# 🎯 À FAIRE MAINTENANT

## Étape 1 : Exécuter le SQL dans Supabase (2 minutes)

### Action
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. **SQL Editor** dans le menu gauche
4. **New query**
5. Copier/coller ce SQL :

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
```

6. **Run** (ou Ctrl+Enter)
7. Attendre le message de succès ✅

---

## Étape 2 : Tester les 4 Combinaisons

### Test 1 : Image-to-3D Standard
1. Aller sur `/studio`
2. Cliquer **"Image vers 3D"**
3. Sélectionner **"Standard"** (1 crédit)
4. Upload une image
5. Cliquer **"GÉNÉRER MODÈLE 3D"**

**Vérifier** :
- ✅ L'image s'upload
- ✅ Le modèle 3D se génère
- ✅ 1 crédit est déduit
- ✅ Pas d'erreur "Failed to deduct credits"

### Test 2 : Image-to-3D Premium
Même chose mais avec **"Premium"** (5 crédits)

### Test 3 : Text-to-3D Standard
1. Cliquer **"Texte vers 3D"**
2. Sélectionner **"Standard"** (1 crédit)
3. Entrer : "Un robot futuriste debout sur une plateforme"
4. Cliquer **"Générer depuis le Texte"**

**Vérifier** :
- ✅ L'image se génère (carte violette)
- ✅ Le modèle 3D se génère (carte verte)
- ✅ 1 crédit est déduit

### Test 4 : Text-to-3D Premium
Même chose avec **"Premium"** (5 crédits)

---

## Étape 3 : Vérifier les Logs Serveur

Dans la console serveur (terminal où tourne `npm run dev`), vous devriez voir :

```
📊 User {userId} has {X} credits
💳 Calling decrement_credits for user {userId}
✅ 1 credit deducted from user {userId}
```

Ou pour premium :
```
✅ 5 credits deducted from user {userId}
```

---

## 🚨 Si ça ne marche pas

### Erreur : "Failed to deduct credits"
→ Le SQL n'a pas été exécuté correctement
→ Recommencer l'Étape 1

### Erreur : "Bucket not found"
→ Créer le bucket "uploads" dans Supabase Storage :
1. **Storage** dans le menu Supabase
2. **New bucket**
3. Nom : `uploads`
4. **Public bucket** : ✅ Coché
5. **Save**

### Erreur : "Insufficient credits"
→ Acheter des crédits sur `/pricing`

---

## 📊 Architecture Finale

| Mode | Qualité | API | Crédits |
|------|---------|-----|---------|
| Text→3D | Standard | `/api/text-to-3d/generate-model` | 1 |
| Text→3D | Premium | `/api/premium-3d/create` | 5 |
| Image→3D | Standard | `/api/generate` | 1 |
| Image→3D | Premium | `/api/premium-3d/create` | 5 |

---

## ✅ Checklist

- [ ] SQL exécuté dans Supabase
- [ ] Test 1 : Image-to-3D Standard fonctionne
- [ ] Test 2 : Image-to-3D Premium fonctionne
- [ ] Test 3 : Text-to-3D Standard fonctionne
- [ ] Test 4 : Text-to-3D Premium fonctionne
- [ ] Logs serveur affichent "credit deducted"
- [ ] Aucune erreur "Failed to deduct credits"

---

**Documentation complète** : `CORRECTIONS_FINALES.md`

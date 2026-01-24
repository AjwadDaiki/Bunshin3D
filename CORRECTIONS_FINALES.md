# ✅ Corrections Finales - Architecture 3D Complète

## 📊 Architecture Finale (4 Combinaisons)

| Mode | Qualité | API Endpoint | Modèle IA | Crédits |
|------|---------|--------------|-----------|---------|
| **Text-to-3D** | Standard | `/api/text-to-3d/generate-model` | Trellis | 1 |
| **Text-to-3D** | Premium | `/api/premium-3d/create` | Rodin | 5 |
| **Image-to-3D** | Standard | `/api/generate` | Trellis | 1 |
| **Image-to-3D** | Premium | `/api/premium-3d/create` | Rodin | 5 |

---

## 🔧 Fichiers Modifiés

### 1. `components/studio/StudioInterface.tsx` ✅
**Changement** : Logique de sélection d'API mise à jour

**Avant** :
```typescript
const apiEndpoint = quality === "premium"
  ? "/api/premium-3d/create"
  : "/api/text-to-3d/generate-model";
```

**Après** :
```typescript
let apiEndpoint: string;
if (quality === "premium") {
  apiEndpoint = "/api/premium-3d/create";
} else {
  apiEndpoint = mode === "text"
    ? "/api/text-to-3d/generate-model"
    : "/api/generate";
}
```

**Impact** :
- ✅ Image-to-3D Standard utilise maintenant `/api/generate`
- ✅ Text-to-3D Standard utilise `/api/text-to-3d/generate-model`
- ✅ Premium (Image ET Text) utilise `/api/premium-3d/create`

---

### 2. `app/api/generate/route.ts` ✅ RÉÉCRIT COMPLÈTEMENT
**Changement** : Refonte totale pour utiliser l'API Predictions (asynchrone)

**Ancien comportement** :
- Utilisait `replicate.run()` (synchrone, attend le résultat)
- Retournait `{ success: true, modelUrl }`
- Format incompatible avec StudioInterface

**Nouveau comportement** :
- Utilise Replicate Predictions API (fetch, asynchrone)
- Retourne `{ predictionId, status }`
- Format cohérent avec les autres APIs
- Support du polling via `/api/check-status/{predictionId}`

**Ce qu'il fait maintenant** :
1. ✅ Vérifie le profil utilisateur
2. ✅ Vérifie qu'il a au moins 1 crédit
3. ✅ **DÉDUIT 1 crédit AVANT d'appeler Replicate**
4. ✅ Appelle Replicate Trellis (version `e8f6c45...`)
5. ✅ Retourne le `predictionId` pour polling
6. ✅ Rembourse le crédit si Replicate échoue

---

### 3. `app/api/text-to-3d/generate-model/route.ts` ✅ Inchangé
**Statut** : Déjà correct

**Ce qu'il fait** :
- Prend une **image** en entrée (pas du texte !)
- Appelle Trellis pour convertir en 3D
- Déduit 1 crédit
- Retourne `predictionId` pour polling

**Utilisé par** :
- ✅ Text-to-3D Standard (après génération d'image)

---

### 4. `app/api/premium-3d/create/route.ts` ✅ Inchangé
**Statut** : Déjà correct

**Ce qu'il fait** :
- Prend une **image** en entrée
- Appelle Rodin pour conversion 3D premium
- Déduit 5 crédits
- Retourne `predictionId` pour polling

**Utilisé par** :
- ✅ Text-to-3D Premium (après génération d'image)
- ✅ Image-to-3D Premium

---

## 🚨 ACTION REQUISE - Exécuter le SQL Supabase

**Fichier** : `supabase/migrations/fix_credits_function_order.sql`

### Pourquoi ?
L'erreur actuelle :
```
Failed to deduct credits: Could not find the function public.decrement_credits(amount, target_user_id)
```

Vient de l'ordre des paramètres. Supabase JS réordonne les clés par ordre **alphabétique**.

### Comment ?
1. Ouvrir https://supabase.com/dashboard
2. **SQL Editor** → **New query**
3. Copier/coller le contenu de `supabase/migrations/fix_credits_function_order.sql`
4. **Run** ✅

### Le SQL crée quoi ?
```sql
CREATE OR REPLACE FUNCTION decrement_credits(amount integer, target_user_id uuid)
CREATE OR REPLACE FUNCTION increment_credits(amount integer, target_user_id uuid)
```

**Ordre alphabétique** : `amount` puis `target_user_id`

---

## ✅ Tests à Effectuer (Les 4 Combinaisons)

### Test 1 : Text-to-3D Standard ✅
```
1. Mode: "Texte vers 3D"
2. Qualité: "Standard" (1 crédit)
3. Prompt: "Un robot futuriste debout sur une plateforme"
4. Cliquer "Générer depuis le Texte"

✅ Attendu:
- Image générée affichée (carte violette)
- Modèle 3D généré (carte verte)
- 1 crédit déduit
- API utilisée: /api/text-to-3d/generate-model
```

### Test 2 : Text-to-3D Premium ✅
```
1. Mode: "Texte vers 3D"
2. Qualité: "Premium" (5 crédits)
3. Prompt: "Un casque de moto futuriste"
4. Cliquer "Générer depuis le Texte"

✅ Attendu:
- Image générée affichée
- Modèle 3D premium généré
- 5 crédits déduits
- API utilisée: /api/premium-3d/create
```

### Test 3 : Image-to-3D Standard ✅
```
1. Mode: "Image vers 3D"
2. Qualité: "Standard" (1 crédit)
3. Upload une image
4. Cliquer "GÉNÉRER MODÈLE 3D"

✅ Attendu:
- Image uploadée vers Supabase Storage
- Modèle 3D généré
- 1 crédit déduit
- API utilisée: /api/generate
```

### Test 4 : Image-to-3D Premium ✅
```
1. Mode: "Image vers 3D"
2. Qualité: "Premium" (5 crédits)
3. Upload une image
4. Cliquer "GÉNÉRER MODÈLE 3D"

✅ Attendu:
- Image uploadée vers Supabase Storage
- Modèle 3D premium généré
- 5 crédits déduits
- API utilisée: /api/premium-3d/create
```

---

## 📋 Checklist Finale

### Avant de Tester
- [ ] Exécuter le SQL `fix_credits_function_order.sql` dans Supabase
- [ ] Vérifier que le bucket "uploads" existe dans Supabase Storage
- [ ] Vérifier `REPLICATE_API_TOKEN` dans les variables d'environnement

### Vérifications dans les Logs
Après chaque génération, vérifier dans la console serveur :

```
📊 User {userId} has {X} credits
💳 Calling decrement_credits for user {userId}
✅ {amount} credit(s) deducted from user {userId}
```

Si vous voyez ça, tout fonctionne ! ✅

### Si ça échoue
Vérifier l'erreur exacte :
- `Could not find the function...` → SQL pas exécuté
- `Bucket not found` → Créer le bucket "uploads"
- `Insufficient credits` → Acheter des crédits
- `User not found` → Problème d'authentification

---

## 🎯 Résumé des APIs

| API | Fonction | Entrée | Sortie | Crédit |
|-----|----------|--------|--------|--------|
| `/api/text-to-3d/generate-image` | Génère image depuis texte | `{ prompt, userId }` | `{ predictionId }` | 0 |
| `/api/generate` | Image→3D Standard | `{ imageUrl, userId }` | `{ predictionId }` | 1 |
| `/api/text-to-3d/generate-model` | Image→3D Standard | `{ imageUrl, userId }` | `{ predictionId }` | 1 |
| `/api/premium-3d/create` | Image→3D Premium | `{ imageUrl, userId }` | `{ predictionId }` | 5 |
| `/api/check-status/[id]` | Polling | `{ id }` | `{ status, output }` | 0 |

---

## 🔥 Différences Clés

### `/api/generate` vs `/api/text-to-3d/generate-model`

**Tous les deux font Image→3D Standard avec Trellis !**

| Aspect | `/api/generate` | `/api/text-to-3d/generate-model` |
|--------|-----------------|----------------------------------|
| **Utilisé pour** | Image-to-3D Standard | Text-to-3D Standard |
| **Version Trellis** | `e8f6c45...` | `4fed84c2...` |
| **Paramètre entrée** | `images: [imageUrl]` | `image: imageUrl` |
| **Nom logique** | ✅ Correct | ❌ Trompeur (prend une image !) |

**Pourquoi garder les deux ?**
- Versions différentes de Trellis
- Paramètres d'entrée légèrement différents
- Permet d'optimiser séparément

---

**Date** : 2026-01-23
**Version** : Finale
**Statut** : ✅ Prêt pour tests

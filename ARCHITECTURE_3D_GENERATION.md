# 🏗️ Architecture de Génération 3D - Bunshin3D

## Vue d'Ensemble

Le système supporte **4 combinaisons** de génération 3D :

| Mode | Qualité | Coût | API Endpoint |
|------|---------|------|--------------|
| **Text-to-3D** | Standard | 1 crédit | `/api/text-to-3d/generate-image` → `/api/text-to-3d/generate-model` |
| **Text-to-3D** | Premium | 5 crédits | `/api/text-to-3d/generate-image` → `/api/premium-3d/create` |
| **Image-to-3D** | Standard | 1 crédit | Upload Supabase → `/api/text-to-3d/generate-model` |
| **Image-to-3D** | Premium | 5 crédits | Upload Supabase → `/api/premium-3d/create` |

---

## 🔄 Flow Détaillé

### 1️⃣ Text-to-3D Standard (1 crédit)

**Composant** : `StudioInterface.tsx`

```
Utilisateur entre texte
    ↓
/api/text-to-3d/generate-image (Flux Schnell)
    ↓
Image générée affichée
    ↓
/api/text-to-3d/generate-model (Trellis) ← DÉDUIT 1 CRÉDIT
    ↓
Modèle 3D GLB prêt
```

**Fichiers impliqués** :
- `app/api/text-to-3d/generate-image/route.ts` - Génération image (pas de déduction)
- `app/api/text-to-3d/generate-model/route.ts` - Conversion 3D (DÉDUIT 1 crédit)

---

### 2️⃣ Text-to-3D Premium (5 crédits)

```
Utilisateur entre texte
    ↓
/api/text-to-3d/generate-image (Flux Schnell)
    ↓
Image générée affichée
    ↓
/api/premium-3d/create (Rodin) ← DÉDUIT 5 CRÉDITS
    ↓
Modèle 3D GLB haute qualité prêt
```

**Fichiers impliqués** :
- `app/api/text-to-3d/generate-image/route.ts` - Génération image (pas de déduction)
- `app/api/premium-3d/create/route.ts` - Conversion 3D premium (DÉDUIT 5 crédits)

---

### 3️⃣ Image-to-3D Standard (1 crédit)

```
Utilisateur upload image
    ↓
Upload vers Supabase Storage (bucket: uploads)
    ↓
/api/text-to-3d/generate-model (Trellis) ← DÉDUIT 1 CRÉDIT
    ↓
Modèle 3D GLB prêt
```

**Fichiers impliqués** :
- `components/studio/StudioInterface.tsx` - Upload direct Supabase
- `app/api/text-to-3d/generate-model/route.ts` - Conversion 3D (DÉDUIT 1 crédit)

---

### 4️⃣ Image-to-3D Premium (5 crédits)

```
Utilisateur upload image
    ↓
Upload vers Supabase Storage (bucket: uploads)
    ↓
/api/premium-3d/create (Rodin) ← DÉDUIT 5 CRÉDITS
    ↓
Modèle 3D GLB haute qualité prêt
```

**Fichiers impliqués** :
- `components/studio/StudioInterface.tsx` - Upload direct Supabase
- `app/api/premium-3d/create/route.ts` - Conversion 3D premium (DÉDUIT 5 crédits)

---

## 🔑 Logique de Sélection de l'API

**Dans** `StudioInterface.tsx` ligne 166-168 :

```typescript
const apiEndpoint = quality === "premium"
  ? "/api/premium-3d/create"     // 5 crédits
  : "/api/text-to-3d/generate-model";  // 1 crédit
```

**Règle** :
- Si `quality === "premium"` → Rodin (5 crédits)
- Si `quality === "standard"` → Trellis (1 crédit)

---

## 🗄️ APIs de Génération

### `/api/text-to-3d/generate-image` (Flux Schnell)
- **Fonction** : Génère une image optimisée à partir d'un prompt texte
- **Modèle IA** : Flux Schnell (Replicate)
- **Déduction** : ❌ Pas de déduction de crédit (étape intermédiaire)
- **Retourne** : `predictionId` pour polling

### `/api/text-to-3d/generate-model` (Trellis - Standard)
- **Fonction** : Convertit une image en modèle 3D
- **Modèle IA** : Trellis (Replicate)
- **Déduction** : ✅ **1 crédit**
- **Appelé par** :
  - Text-to-3D Standard
  - Image-to-3D Standard
- **Fichier** : `app/api/text-to-3d/generate-model/route.ts`

### `/api/premium-3d/create` (Rodin - Premium)
- **Fonction** : Convertit une image en modèle 3D haute qualité
- **Modèle IA** : Rodin (Replicate)
- **Déduction** : ✅ **5 crédits**
- **Appelé par** :
  - Text-to-3D Premium
  - Image-to-3D Premium
- **Fichier** : `app/api/premium-3d/create/route.ts`

### `/api/check-status/[id]`
- **Fonction** : Vérifie le statut d'une prédiction Replicate
- **Déduction** : ❌ Pas de déduction
- **Utilisé par** : Toutes les générations (polling)

---

## ⚠️ Fichiers NON Utilisés

### `/api/generate/route.ts`
**Statut** : ❌ **OBSOLÈTE - NE PAS SUPPRIMER ENCORE**

Ce fichier était l'ancienne API de génération avant la refonte. Il n'est plus appelé par le frontend actuel mais pourrait être utilisé par :
- Des anciens clients
- Des scripts externes
- Des webhooks

**Vérification nécessaire** : Grep dans tout le projet pour confirmer qu'il n'est plus utilisé.

---

## 🐛 Bug Actuel Identifié

### Erreur : "Could not find the function public.decrement_credits(amount, target_user_id)"

**Cause** : Ordre des paramètres incorrect dans la fonction SQL

**Explication** :
1. Le code JavaScript appelle :
```javascript
supabase.rpc("decrement_credits", {
  target_user_id: userId,
  amount: 1,
})
```

2. Supabase JS **réordonne automatiquement par ordre alphabétique** :
   - `amount` vient avant `target_user_id`
   - Donc cherche : `decrement_credits(amount, target_user_id)`

3. Mais la fonction SQL est définie comme :
```sql
CREATE FUNCTION decrement_credits(target_user_id uuid, amount integer)
```

**Solution** : Exécuter `supabase/migrations/fix_credits_function_order.sql` qui redéfinit les fonctions avec paramètres en ordre alphabétique.

---

## 🔧 Fichiers à Modifier pour Corriger

### Aucun fichier JavaScript/TypeScript à modifier !

Le code actuel est correct. C'est la fonction SQL qui doit être recréée.

### Fichier SQL à exécuter dans Supabase

📁 `supabase/migrations/fix_credits_function_order.sql`

Redéfinit :
- `decrement_credits(amount integer, target_user_id uuid)` ✅
- `increment_credits(amount integer, target_user_id uuid)` ✅

---

## ✅ Checklist de Vérification Après Fix

Tester les 4 combinaisons :

1. [ ] Text-to-3D Standard → Déduit 1 crédit
2. [ ] Text-to-3D Premium → Déduit 5 crédits
3. [ ] Image-to-3D Standard → Déduit 1 crédit
4. [ ] Image-to-3D Premium → Déduit 5 crédits

Vérifier dans les logs serveur :
- ✅ `📊 User {userId} has {X} credits`
- ✅ `💳 Calling decrement_credits for user {userId}`
- ✅ `✅ {amount} credit(s) deducted from user {userId}`

---

**Date** : 2026-01-23
**Version** : 2.0 (Architecture multi-modèle)

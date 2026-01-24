# 🚀 Guide d'Implémentation Complète - Bunshin3D

## ✅ Ce qui a été fait

### 1. Système de Génération 3D à Deux Niveaux

#### 📦 **Text-to-3D Standard** (1 Crédit) - `/text-to-3d`
- **Pipeline à 2 étapes** :
  - Étape A : Text-to-Image avec Flux Schnell (Replicate)
  - Étape B : Image-to-3D avec Trellis
- **Optimisation automatique du prompt** : Ajoute automatiquement les paramètres 3D optimaux
- **Interface progressive** : Affiche l'image générée avant la conversion 3D
- **Polling intelligent** : Vérification automatique du statut toutes les 2-3 secondes

#### ⭐ **Premium Image-to-3D** (5 Crédits) - `/premium-3d`
- **Haute fidélité** avec Rodin AI
- **Upload d'image** : Téléchargement vers Supabase Storage
- **Modal d'avertissement** : Confirmation avant de dépenser 5 crédits
- **Qualité cinéma** : Textures photoréalistes et géométrie avancée

### 2. APIs Créées

| Route | Fonction | Coût |
|-------|----------|------|
| `/api/text-to-3d/generate-image` | Génère image depuis texte (Flux Schnell) | 0 |
| `/api/text-to-3d/generate-model` | Convertit image en 3D (Trellis) | 1 crédit |
| `/api/premium-3d/create` | Génération premium (Rodin) | 5 crédits |
| `/api/check-status/[id]` | Vérifie statut d'une génération | 0 |

### 3. Traductions Ajoutées

#### Fichiers modifiés :
- ✅ `messages/en.json` : Ajout de 3 nouvelles sections (Common, TextTo3D, Premium3D, Showcase)
- ✅ `messages/fr.json` : Traductions françaises complètes
- ⏳ `messages/es.json`, `de.json`, `ja.json`, `zh.json` : À compléter

#### Nouvelles clés de traduction :
```json
{
  "Common": {
    "skipToContent": "...",
    "generatedAsset": "...",
    "buyCredits": "...",
    ...
  },
  "TextTo3D": { ... },
  "Premium3D": { ... },
  "Showcase": { ... }
}
```

### 4. Navigation Mise à Jour

- **Header Desktop** : Ajout de "Text-to-3D" et "Premium 3D"
- **Header Mobile** : Ajout avec indication des coûts
- **Ordre** : Studio → Text-to-3D → Premium 3D → Pricing

### 5. Base de Données (Supabase)

#### Script SQL créé : `supabase/migrations/add_credit_functions.sql`

```sql
-- Fonction pour décrémenter les crédits (nouvelle)
decrement_credits(target_user_id, amount)

-- Fonction pour incrémenter les crédits (existe déjà normalement)
increment_credits(target_user_id, amount)

-- Colonne 'type' ajoutée à la table generations
ALTER TABLE generations ADD COLUMN type text DEFAULT 'standard';
```

### 6. Manifest Dynamique

- Créé `app/manifest.ts` (Next.js 14+)
- Remplace `public/manifest.json` (à supprimer)
- Configuration PWA complète

---

## 🔧 Configuration Nécessaire

### 1. Appliquer les Migrations SQL

```bash
# Dans Supabase Studio, allez dans SQL Editor et exécutez :
cat supabase/migrations/add_credit_functions.sql
```

Ou via CLI :
```bash
supabase db push
```

### 2. Vérifier les Versions Replicate

Les modèles Replicate changent régulièrement. Vérifiez les versions actuelles :

#### Flux Schnell (Text-to-Image)
```typescript
// app/api/text-to-3d/generate-image/route.ts ligne 63
version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637"
```
👉 Vérifier sur https://replicate.com/black-forest-labs/flux-schnell

#### Trellis (Image-to-3D)
```typescript
// app/api/text-to-3d/generate-model/route.ts ligne 57
version: "4fed84c2fa798b898e57c2aae66b79fc5f20ac76f4c2f7b8b8c9f7f4b9f7f4b9"
```
👉 Vérifier sur https://replicate.com/jeffreyxi/trellis

#### Rodin (Premium 3D)
```typescript
// app/api/premium-3d/create/route.ts ligne 68
version: "hyper3d/rodin"
```
👉 Vérifier sur https://replicate.com/hyper3d/rodin

### 3. Configurer Supabase Storage

Créez un bucket pour les uploads :

```sql
-- Dans Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Politique RLS pour permettre les uploads
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Politique RLS pour lecture publique
CREATE POLICY "Public can read uploads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');
```

---

## 🎨 Utilisation

### Text-to-3D Standard

1. Allez sur `/text-to-3d`
2. Entrez une description (ex: "A futuristic robot")
3. Cliquez sur "Generate 3D Model"
4. Étape 1 : L'IA génère une image optimisée (15-20s)
5. Étape 2 : Conversion en modèle 3D (30-40s)
6. Téléchargez le fichier .glb

### Premium Image-to-3D

1. Allez sur `/premium-3d`
2. Upload une image (max 10MB)
3. Cliquez sur "Generate Premium 3D"
4. Confirmez les 5 crédits
5. Attendez ~2 minutes
6. Téléchargez le modèle haute qualité

---

## 📊 Système de Crédits

| Action | Coût |
|--------|------|
| Text-to-Image (Flux) | 0 crédit (partie du pipeline) |
| Text-to-3D Standard | **1 crédit** |
| Premium Image-to-3D | **5 crédits** |

### Logique de Déduction

- **Text-to-3D** : Crédit déduit lors de l'appel à `/generate-model` (après l'image)
- **Premium 3D** : Crédits déduits au début, remboursés en cas d'échec API

---

## 🌍 Traductions à Compléter

Fichiers à mettre à jour avec les nouvelles clés :

### Espagnol (`messages/es.json`)
```json
"Common": {
  "skipToContent": "Saltar al contenido principal",
  "generatedAsset": "Activo Generado",
  "buyCredits": "Comprar Créditos",
  ...
}
```

### Allemand (`messages/de.json`)
```json
"Common": {
  "skipToContent": "Zum Hauptinhalt springen",
  "generatedAsset": "Generiertes Asset",
  "buyCredits": "Credits kaufen",
  ...
}
```

### Japonais (`messages/ja.json`)
```json
"Common": {
  "skipToContent": "メインコンテンツにスキップ",
  "generatedAsset": "生成されたアセット",
  "buyCredits": "クレジットを購入",
  ...
}
```

### Chinois (`messages/zh.json`)
```json
"Common": {
  "skipToContent": "跳转到主要内容",
  "generatedAsset": "生成的资产",
  "buyCredits": "购买积分",
  ...
}
```

---

## 💰 Conversion de Devises (Optionnel)

Pour implémenter la conversion automatique de devises :

### Option 1 : API de Taux de Change

```typescript
// lib/currency-converter.ts
const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  JPY: 163.5,
  CNY: 7.86,
};

export function convertPrice(priceEUR: number, targetCurrency: string) {
  return (priceEUR * EXCHANGE_RATES[targetCurrency]).toFixed(2);
}
```

### Option 2 : Stripe Multi-Currency

Créez des Price IDs pour chaque devise dans Stripe Dashboard.

---

## 🚨 Points d'Attention

### 1. Versions Replicate

⚠️ Les versions de modèles Replicate peuvent changer. Vérifiez régulièrement.

### 2. Coûts Replicate

- **Flux Schnell** : ~$0.003 par génération
- **Trellis** : ~$0.10 par conversion 3D
- **Rodin** : ~$0.50 par modèle premium

**Marges recommandées** :
- Text-to-3D (1 crédit = 0.50€) → Marge ~80%
- Premium 3D (5 crédits = 2.50€) → Marge ~80%

### 3. Limites de Temps

- Flux Schnell : 15-30 secondes
- Trellis : 30-60 secondes
- Rodin : 1-3 minutes

### 4. Gestion des Échecs

Tous les endpoints incluent :
- Remboursement automatique en cas d'échec
- Logs détaillés
- Messages d'erreur clairs

---

## 🔗 Fichiers Créés

```
app/
├── api/
│   ├── text-to-3d/
│   │   ├── generate-image/route.ts
│   │   └── generate-model/route.ts
│   ├── premium-3d/
│   │   └── create/route.ts
│   └── check-status/[id]/route.ts
├── [locale]/
│   ├── text-to-3d/page.tsx
│   └── premium-3d/page.tsx
├── manifest.ts (NOUVEAU)
└── globals.css (modifié)

components/
└── layout/
    └── HeaderNew.tsx (modifié)

messages/
├── en.json (modifié)
└── fr.json (modifié)

supabase/
└── migrations/
    └── add_credit_functions.sql (NOUVEAU)
```

---

## ✅ Checklist de Déploiement

- [ ] Appliquer les migrations SQL Supabase
- [ ] Vérifier les versions Replicate
- [ ] Créer le bucket `uploads` dans Storage
- [ ] Tester Text-to-3D avec 1 crédit
- [ ] Tester Premium 3D avec 5 crédits
- [ ] Compléter les traductions (es, de, ja, zh)
- [ ] Supprimer `public/manifest.json` (remplacé par `manifest.ts`)
- [ ] Vérifier que les crédits se déduisent correctement
- [ ] Tester le téléchargement des fichiers .glb
- [ ] Vérifier les logs dans Replicate Dashboard

---

## 🎉 Résultat Final

Vous avez maintenant un système complet de génération 3D avec :

✅ **2 niveaux de qualité** (Standard 1 crédit, Premium 5 crédits)
✅ **Pipeline optimisé** (Text → Image → 3D)
✅ **Interface moderne** avec feedback en temps réel
✅ **Gestion automatique des crédits**
✅ **Traductions multilingues** (EN + FR prêtes, autres à compléter)
✅ **Manifest PWA dynamique**
✅ **APIs robustes** avec gestion d'erreurs

Le système est prêt à être testé ! 🚀

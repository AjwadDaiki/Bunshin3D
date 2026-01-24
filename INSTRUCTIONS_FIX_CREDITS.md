# 🔧 FIX URGENT - Fonction decrement_credits

## Problème Identifié

L'erreur `Could not find the function public.decrement_credits(amount, target_user_id)` est causée par un **ordre de paramètres incorrect**.

### Cause Racine

Supabase JS réordonne automatiquement les paramètres d'objets JavaScript par **ordre alphabétique** :

```javascript
// Dans le code JavaScript
supabase.rpc("decrement_credits", {
  target_user_id: userId,  // Défini en premier
  amount: 1                // Défini en second
})

// Mais Supabase JS réordonne alphabétiquement :
// { amount: 1, target_user_id: userId }
```

Donc Supabase cherche une fonction avec la signature : `(amount, target_user_id)`

Mais la fonction SQL actuelle est définie comme : `(target_user_id, amount)` ❌

## Solution

Exécuter le fichier SQL suivant dans Supabase Dashboard :

📁 **Fichier** : `supabase/migrations/fix_credits_function_order.sql`

## Instructions d'Installation

### 1. Aller dans Supabase Dashboard

1. Ouvrir https://supabase.com/dashboard
2. Sélectionner votre projet Bunshin3D
3. Cliquer sur **SQL Editor** dans le menu latéral

### 2. Exécuter le SQL

1. Copier tout le contenu du fichier `supabase/migrations/fix_credits_function_order.sql`
2. Coller dans l'éditeur SQL
3. Cliquer sur **Run** (ou Ctrl+Enter)

### 3. Vérification

Exécuter cette requête pour vérifier que les fonctions ont été recréées :

```sql
SELECT
  routine_name,
  routine_schema,
  string_agg(
    parameter_name || ' ' || data_type,
    ', ' ORDER BY ordinal_position
  ) as parameters
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p
  ON r.specific_name = p.specific_name
WHERE routine_schema = 'public'
  AND routine_name IN ('decrement_credits', 'increment_credits')
GROUP BY routine_name, routine_schema;
```

**Résultat attendu** :
```
decrement_credits | public | amount integer, target_user_id uuid
increment_credits | public | amount integer, target_user_id uuid
```

## Impact

Après cette modification, toutes les opérations de crédits fonctionneront :

- ✅ Image-to-3D Standard (1 crédit)
- ✅ Image-to-3D Premium (5 crédits)
- ✅ Text-to-3D Standard (1 crédit)
- ✅ Text-to-3D Premium (5 crédits)

## Pourquoi cette approche ?

Au lieu de modifier tout le code JavaScript pour changer l'ordre des paramètres, on modifie la fonction SQL pour correspondre à l'ordre alphabétique. Cela garantit la compatibilité avec le comportement par défaut de Supabase JS.

## Fonctionnalités Ajoutées

Les nouvelles fonctions incluent aussi :
- ✅ Vérification d'existence de l'utilisateur
- ✅ Exception levée si l'utilisateur n'existe pas
- ✅ Commentaires explicites sur l'ordre alphabétique

---

**Date** : 2026-01-23
**Fichier à exécuter** : `supabase/migrations/fix_credits_function_order.sql`

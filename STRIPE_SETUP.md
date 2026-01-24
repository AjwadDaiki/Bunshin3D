# 🛒 Guide de Configuration Stripe pour Bunshin3D

## 🔴 Problème Actuel

Les Price IDs dans votre code **n'existent pas** dans votre compte Stripe LIVE. C'est pourquoi les paiements échouent.

```
❌ price_1Srgy7DAkIojEyhWRCOAcKJP (Discovery) - Introuvable
❌ price_1SriLJDAkIojEyhW2tIHSja0 (Creator) - Introuvable
❌ price_1SriLdDAkIojEyhWEZqrg1xx (Studio) - Introuvable
```

## ✅ Solution : Créer les Produits Stripe

### Étape 1 : Accéder au Dashboard Stripe

1. Allez sur https://dashboard.stripe.com/
2. **Assurez-vous d'être en mode LIVE** (toggle en haut à droite)

### Étape 2 : Créer les 3 Produits

#### 📦 Pack Découverte (2.99 EUR)

1. Cliquez sur **Product catalog** > **Add product**
2. Remplissez :
   - **Name**: `Pack Découverte - 10 Crédits`
   - **Description**: `Pack de démarrage avec 10 crédits pour générer vos premiers modèles 3D`
   - **Pricing model**: `Standard pricing`
   - **Price**: `2.99`
   - **Currency**: `EUR`
   - **Billing period**: `One time`
3. Cliquez sur **Save product**
4. **Copiez le Price ID** (format `price_xxxxx`)

#### ⚡ Pack Créateur (9.99 EUR)

1. **Add product**
2. Remplissez :
   - **Name**: `Pack Créateur - 50 Crédits`
   - **Description**: `Pack populaire avec 50 crédits pour vos projets créatifs`
   - **Pricing model**: `Standard pricing`
   - **Price**: `9.99`
   - **Currency**: `EUR`
   - **Billing period**: `One time`
3. Cliquez sur **Save product**
4. **Copiez le Price ID**

#### ✨ Pack Studio (29.99 EUR)

1. **Add product**
2. Remplissez :
   - **Name**: `Pack Studio - 200 Crédits`
   - **Description**: `Pack professionnel avec 200 crédits pour une production intensive`
   - **Pricing model**: `Standard pricing`
   - **Price**: `29.99`
   - **Currency**: `EUR`
   - **Billing period**: `One time`
3. Cliquez sur **Save product**
4. **Copiez le Price ID**

### Étape 3 : Mettre à Jour le Code

Ouvrez `app/api/checkout/route.ts` et remplacez les Price IDs :

```typescript
const packs = {
  discovery: {
    priceId: "price_VOTRE_NOUVEAU_ID_DISCOVERY", // ← Remplacez ici
    credits: 10,
  },
  creator: {
    priceId: "price_VOTRE_NOUVEAU_ID_CREATOR", // ← Remplacez ici
    credits: 50,
  },
  studio: {
    priceId: "price_VOTRE_NOUVEAU_ID_STUDIO", // ← Remplacez ici
    credits: 200,
  },
};
```

### Étape 4 : Configurer le Webhook Stripe

1. Dans le Dashboard Stripe, allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. Remplissez :
   - **Endpoint URL**: `https://bunshin3d.com/api/webhooks/stripe`
   - **Events to send**: Sélectionnez `checkout.session.completed`
4. Cliquez sur **Add endpoint**
5. **Copiez le Signing secret** (format `whsec_xxxxx`)
6. Mettez à jour `STRIPE_WEBHOOK_SECRET` dans `.env`

### Étape 5 : Tester

```bash
# Redémarrez le serveur
npm run dev

# Testez un paiement sur http://localhost:3000/pricing
```

## 🧪 Mode TEST (Pour le développement)

Si vous voulez tester sans créer de vrais produits :

1. Dans Stripe Dashboard, **passez en mode TEST** (toggle en haut)
2. Créez les mêmes produits en mode TEST
3. Utilisez les clés TEST :
   - `pk_test_xxxxx` pour NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - `sk_test_xxxxx` pour STRIPE_SECRET_KEY
4. Pour tester, utilisez la carte : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

## 📊 Vérifier que ça Fonctionne

Exécutez ce script pour vérifier vos Price IDs :

```bash
node scripts/test-stripe.js
```

Vous devriez voir :

```
✅ price_xxxxx
   - Amount: 2.99€
   - Currency: EUR
   - Active: true
```

## ⚠️ Points Importants

- **LIVE vs TEST** : Ne mélangez jamais les clés LIVE avec les Price IDs TEST
- **Webhook** : Configurez le webhook pour que les crédits soient ajoutés automatiquement
- **Currency** : Tous les prix doivent être en EUR
- **One-time** : Les packs sont des paiements uniques, pas des abonnements

## 🆘 Besoin d'Aide ?

Si vous avez des erreurs :

1. Vérifiez la console du navigateur (F12)
2. Vérifiez la console du serveur
3. Vérifiez les logs Stripe dans **Developers** > **Logs**

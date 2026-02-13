# Configuration Stripe Test Mode

## 1. `STRIPE_TEST_SECRET_KEY`

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. En haut a droite, active le toggle **"Test mode"**
3. Va dans **Developers** > **API keys**
4. Copie la **Secret key** (commence par `sk_test_...`)
5. Colle-la dans ton `.env` :
   ```
   STRIPE_TEST_SECRET_KEY=sk_test_...
   ```

## 2. `STRIPE_TEST_WEBHOOK_SECRET`

1. Toujours en **Test mode**, va dans **Developers** > **Webhooks**
2. Clique **Add endpoint**
3. Configure :
   - **Endpoint URL** : `https://ton-domaine.com/api/webhooks/stripe`
   - **Events** : selectionne `checkout.session.completed`
4. Clique **Add endpoint**
5. Sur la page du webhook, clique **Reveal** sous "Signing secret"
6. Copie le secret (commence par `whsec_...`)
7. Colle-le dans ton `.env` :
   ```
   STRIPE_TEST_WEBHOOK_SECRET=whsec_...
   ```

### Test en local avec Stripe CLI

Si tu veux tester en local (localhost) :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

La CLI affichera un webhook signing secret temporaire (`whsec_...`). Utilise-le comme `STRIPE_TEST_WEBHOOK_SECRET`.

## Resultat final dans `.env`

```env
# Stripe Live (deja en place)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Test
STRIPE_TEST_SECRET_KEY=sk_test_...
STRIPE_TEST_WEBHOOK_SECRET=whsec_...
```

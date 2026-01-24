// Script de test pour vérifier les Price IDs Stripe
const fs = require('fs');
const path = require('path');

// Lecture manuelle du fichier .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    const value = valueParts.join('=').replace(/^["']|["']$/g, '');
    process.env[key.trim()] = value.trim();
  }
});

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

async function testPriceIds() {
  const priceIds = [
    'price_1SsXtCRcc7sv4ae7cewEcPmX', // Discovery (2.99€)
    'price_1SsXuWRcc7sv4ae7iFxnyujz', // Creator (9.99€)
    'price_1SsXvjRcc7sv4ae7add6yPXT', // Studio (29.99€)
  ];

  console.log('🔍 Testing Stripe Price IDs...\n');

  for (const priceId of priceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(`✅ ${priceId}`);
      console.log(`   - Amount: ${price.unit_amount / 100}€`);
      console.log(`   - Currency: ${price.currency.toUpperCase()}`);
      console.log(`   - Active: ${price.active}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${priceId}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Test de création de session
  console.log('🛒 Testing checkout session creation...\n');
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[0], // Test avec le premier
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://bunshin3d.com/studio?success=true',
      cancel_url: 'https://bunshin3d.com/pricing?canceled=true',
      metadata: {
        userId: 'test-user',
        packId: 'discovery',
        credits: '10',
      },
    });

    console.log('✅ Session created successfully!');
    console.log(`   Session ID: ${session.id}`);
    console.log(`   URL: ${session.url}\n`);
  } catch (error) {
    console.log('❌ Session creation failed');
    console.log(`   Error: ${error.message}\n`);
  }
}

testPriceIds();

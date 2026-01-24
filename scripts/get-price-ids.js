// Script pour récupérer les Price IDs depuis les Product IDs
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

async function getPriceIds() {
  const productIds = {
    discovery: 'prod_TqELcIpcATx2kx',
    creator: 'prod_TqENhIOqhHzdd3',
    studio: 'prod_TqEORAoZzNF0zW',
  };

  console.log('🔍 Récupération des Price IDs...\n');

  for (const [packName, productId] of Object.entries(productIds)) {
    try {
      // Récupérer tous les prix pour ce produit
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });

      if (prices.data.length > 0) {
        const price = prices.data[0]; // Prendre le premier prix actif
        console.log(`✅ ${packName.toUpperCase()}`);
        console.log(`   Product ID: ${productId}`);
        console.log(`   Price ID: ${price.id}`);
        console.log(`   Amount: ${price.unit_amount / 100}€`);
        console.log(`   Currency: ${price.currency.toUpperCase()}`);
        console.log('');
      } else {
        console.log(`❌ ${packName.toUpperCase()}`);
        console.log(`   Aucun prix trouvé pour le produit ${productId}`);
        console.log('');
      }
    } catch (error) {
      console.log(`❌ ${packName.toUpperCase()}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('\n📋 Code à mettre à jour dans app/api/checkout/route.ts:\n');
  console.log('const packs = {');

  for (const [packName, productId] of Object.entries(productIds)) {
    try {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });

      if (prices.data.length > 0) {
        const price = prices.data[0];
        const credits = packName === 'discovery' ? 10 : packName === 'creator' ? 50 : 200;
        const amount = price.unit_amount / 100;

        console.log(`  ${packName}: {`);
        console.log(`    priceId: "${price.id}", // Pack ${packName} (${amount}€)`);
        console.log(`    credits: ${credits},`);
        console.log(`  },`);
      }
    } catch (error) {
      // Ignore errors in summary
    }
  }

  console.log('};');
}

getPriceIds();

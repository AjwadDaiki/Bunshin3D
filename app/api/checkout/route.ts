import { NextResponse } from "next/server";
import Stripe from "stripe";

// Vérification des variables d'environnement
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Configuration Stripe avec version API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: Request) {
  try {
    const { packId, userId } = await request.json();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    console.log(`🛒 Checkout request: packId=${packId}, userId=${userId}, origin=${origin}`);

    if (!userId) {
      console.error("❌ Missing userId");
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Définition des Packs (Connectée au Dashboard Stripe via les Price IDs)
    const packs = {
      discovery: {
        priceId: "price_1SsXtCRcc7sv4ae7cewEcPmX", // Pack Découverte (2.99€)
        credits: 10,
      },
      creator: {
        priceId: "price_1SsXuWRcc7sv4ae7iFxnyujz", // Pack Créateur (9.99€)
        credits: 50,
      },
      studio: {
        priceId: "price_1SsXvjRcc7sv4ae7add6yPXT", // Pack Studio (29.99€)
        credits: 200,
      },
    };

    const selectedPack = packs[packId as keyof typeof packs];

    if (!selectedPack) {
      console.error(`❌ Invalid pack: ${packId}`);
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    console.log(`✅ Selected pack: ${packId}, priceId: ${selectedPack.priceId}, credits: ${selectedPack.credits}`);

    // Création de la Session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPack.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/studio?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      // Métadonnées critiques pour le webhook
      metadata: {
        userId: userId,
        packId: packId,
        credits: selectedPack.credits.toString(),
      },
    });

    console.log(`✅ Stripe session created: ${session.id}`);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe Error:", err.message);
    console.error("Full error:", err);
    return NextResponse.json(
      { error: err.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}

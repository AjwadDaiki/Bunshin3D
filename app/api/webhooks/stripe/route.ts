import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Configuration Stripe avec version API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Client Supabase Admin (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing Stripe signature or secret");
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Gestion de l'événement Checkout Completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Récupération des métadonnées
    const userId = session.metadata?.userId;
    const creditsToAdd = parseInt(session.metadata?.credits || "0");
    const packId = session.metadata?.packId;
    const amountTotal = (session.amount_total || 0) / 100;

    console.log(
      `💰 Payment received from ${userId}: ${amountTotal}€ for ${creditsToAdd} credits (Pack: ${packId}).`,
    );

    try {
      if (userId && creditsToAdd > 0) {
        // 1. UTILISATION DE LA FONCTION SQL 'increment_credits'
        // C'est la méthode sécurisée et atomique définie dans ton SQL
        const { error } = await supabaseAdmin.rpc("increment_credits", {
          target_user_id: userId,
          amount: creditsToAdd,
        });

        if (error) {
          console.error("❌ RPC Error:", error);
          throw error;
        }

        // 2. MAJ du Stripe Customer ID (Optionnel mais utile pour le suivi)
        await supabaseAdmin
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);

        console.log(`✅ User ${userId} credited via RPC (+${creditsToAdd})`);
      } else {
        console.warn("⚠️ Invalid metadata: No userId or 0 credits.");
      }
    } catch (err: any) {
      console.error("❌ Database Update Failed:", err.message);
      // On renvoie 500 pour que Stripe réessaie
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

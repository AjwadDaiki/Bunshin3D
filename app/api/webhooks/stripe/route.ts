import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const runtime = "nodejs";


function verifyWebhookEvent(body: string, sig: string): Stripe.Event {
  const liveSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const testSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET || "";


  if (liveSecret) {
    try {
      return stripe.webhooks.constructEvent(body, sig, liveSecret);
    } catch {

    }
  }


  if (testSecret) {
    try {
      return stripe.webhooks.constructEvent(body, sig, testSecret);
    } catch {

    }
  }

  throw new Error("Signature verification failed against all configured secrets");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) {
      throw new Error("Missing stripe-signature header");
    }
    event = verifyWebhookEvent(body, sig);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Stripe webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  const isTestPayment = (event.data.object as any)?.metadata?.isTestPayment === "true";
  if (isTestPayment) {
    console.log("[Stripe webhook] Processing TEST payment");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const metadata = session.metadata ?? {};
    const userId = metadata.userId;
    const packId = metadata.packId;
    const creditsToAdd = Number.parseInt(metadata.credits || "0", 10);
    const amountTotal = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || "USD";
    const customerEmail = session.customer_details?.email || metadata.userEmail || null;
    const userLocale = metadata.locale || "en";

    if (
      !session.id ||
      !userId ||
      !packId ||
      !Number.isFinite(creditsToAdd) ||
      creditsToAdd <= 0
    ) {
      console.warn("[Stripe webhook] Invalid metadata, skipping:", { userId, packId, creditsToAdd });
      return NextResponse.json({ received: true });
    }

    console.log(
      `[Stripe webhook] Payment received: user=${userId} amount=${amountTotal} credits=${creditsToAdd} pack=${packId}`,
    );

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


    let idempotencyEnabled = true;
    try {
      const { error: idempotencyError } = await supabaseAdmin
        .from("processed_webhooks")
        .insert({
          stripe_event_id: event.id,
          stripe_session_id: session.id,
          user_id: userId,
          event_type: event.type,
        });

      if (idempotencyError) {
        if (idempotencyError.code === "23505") {
          console.log(`[Stripe webhook] Duplicate session ignored: ${session.id}`);
          return NextResponse.json({ received: true });
        }

        const missingTable =
          idempotencyError.code === "PGRST205" ||
          idempotencyError.code === "42P01" ||
          idempotencyError.message?.includes("processed_webhooks");

        if (missingTable) {
          idempotencyEnabled = false;
          console.warn("[Stripe webhook] processed_webhooks table missing; continuing without idempotency");
        } else {
          console.error("[Stripe webhook] Idempotency insert failed:", idempotencyError);
          throw idempotencyError;
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Stripe webhook] Idempotency error: ${msg}`);
      idempotencyEnabled = false;
    }


    let creditsApplied = false;
    try {
      const { error: creditsError } = await supabaseAdmin.rpc("increment_credits", {
        target_user_id: userId,
        amount: creditsToAdd,
      });

      if (creditsError) {
        console.error("[Stripe webhook] increment_credits RPC failed, trying direct UPDATE:", creditsError);

        const { data: currentProfile } = await supabaseAdmin
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();

        const currentCredits = currentProfile?.credits || 0;
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ credits: currentCredits + creditsToAdd })
          .eq("id", userId);

        if (updateError) {
          throw updateError;
        }
      }

      creditsApplied = true;
      console.log(`[Stripe webhook] Credits applied: user=${userId} +${creditsToAdd} credits`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Stripe webhook] CRITICAL: Failed to add credits: ${msg}`);


      if (idempotencyEnabled && session.id) {
        await supabaseAdmin
          .from("processed_webhooks")
          .delete()
          .eq("stripe_session_id", session.id);
      }

      return NextResponse.json(
        { error: "Failed to update credits in database" },
        { status: 500 },
      );
    }


    try {
      if (session.customer && typeof session.customer === "string") {
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: session.customer })
          .eq("id", userId);
      }
    } catch (err) {
      console.warn("[Stripe webhook] Failed to update stripe_customer_id (non-critical):", err);
    }


    if (idempotencyEnabled) {
      try {
        await supabaseAdmin
          .from("processed_webhooks")
          .update({ processed_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id);
      } catch (err) {
        console.warn("[Stripe webhook] Failed to mark as processed:", err);
      }
    }


    if (customerEmail) {
      try {
        await sendPaymentConfirmationEmail({
          email: customerEmail,
          locale: userLocale,
          credits: creditsToAdd,
          packId,
          amount: amountTotal,
          currency,
        });
        console.log(`[Stripe webhook] Confirmation email sent to ${customerEmail}`);
      } catch (err) {
        console.warn("[Stripe webhook] Failed to send confirmation email (non-critical):", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

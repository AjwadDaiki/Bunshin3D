import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getApiTranslations } from "@/lib/api-i18n";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.Stripe");
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error(t("errors.missingSignature"));
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(t("errors.signatureVerification", { message }));
    return NextResponse.json(
      { error: t("responses.webhookError", { message }) },
      { status: 400 },
    );
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

    if (
      !session.id ||
      !userId ||
      !packId ||
      !Number.isFinite(creditsToAdd) ||
      creditsToAdd <= 0
    ) {
      console.warn(t("warnings.invalidMetadata"));
      return NextResponse.json({ received: true });
    }

    console.log(
      t("logs.paymentReceived", {
        userId,
        amount: amountTotal,
        credits: creditsToAdd,
        packId,
      }),
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

    let creditsApplied = false;
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
          console.log(
            `[Stripe webhook] Duplicate session ignored: ${session.id}`,
          );
          return NextResponse.json({ received: true });
        }

        const missingIdempotencyTable =
          idempotencyError.code === "PGRST205" ||
          idempotencyError.code === "42P01" ||
          idempotencyError.message.includes("processed_webhooks");

        if (missingIdempotencyTable) {
          idempotencyEnabled = false;
          console.warn(
            "[Stripe webhook] processed_webhooks table missing; continuing without idempotency",
          );
        } else {
          console.error(
            "[Stripe webhook] Idempotency insert failed",
            idempotencyError,
          );
          throw idempotencyError;
        }
      }

      if (session.customer && typeof session.customer === "string") {
        const { error: customerError } = await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: session.customer })
          .eq("id", userId);

        if (customerError) {
          throw customerError;
        }
      }

      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("referred_by, referral_reward_paid")
        .eq("id", userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (profile?.referred_by && !profile.referral_reward_paid) {
        const { error: referralCreditsError } = await supabaseAdmin.rpc(
          "increment_credits",
          {
            target_user_id: profile.referred_by,
            amount: 10,
          },
        );

        if (referralCreditsError) {
          throw referralCreditsError;
        }

        const { error: referralFlagError } = await supabaseAdmin
          .from("profiles")
          .update({ referral_reward_paid: true })
          .eq("id", userId);

        if (referralFlagError) {
          throw referralFlagError;
        }

        console.log(
          t("logs.referralBonus", { userId: profile.referred_by, credits: 10 }),
        );
      }

      const { error: creditsError } = await supabaseAdmin.rpc("increment_credits", {
        target_user_id: userId,
        amount: creditsToAdd,
      });

      if (creditsError) {
        throw creditsError;
      }

      creditsApplied = true;
      console.log(t("logs.userCredited", { userId, credits: creditsToAdd }));

      if (idempotencyEnabled) {
        const { error: markProcessedError } = await supabaseAdmin
          .from("processed_webhooks")
          .update({ processed_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id);

        if (markProcessedError) {
          console.error(
            `[Stripe webhook] Failed to mark processed for session ${session.id}`,
            markProcessedError,
          );
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (!creditsApplied && idempotencyEnabled && session.id) {
        await supabaseAdmin
          .from("processed_webhooks")
          .delete()
          .eq("stripe_session_id", session.id);
      }

      console.error(t("errors.dbUpdateFailed", { message }));
      return NextResponse.json(
        { error: t("responses.dbUpdateFailed") },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

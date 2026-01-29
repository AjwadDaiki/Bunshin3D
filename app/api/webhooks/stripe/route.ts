import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getApiTranslations } from "@/lib/api-i18n";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
  } catch (err: any) {
    console.error(t("errors.signatureVerification", { message: err.message }));
    return NextResponse.json(
      { error: t("responses.webhookError", { message: err.message }) },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const userId = metadata.userId;
    const packId = metadata.packId;
    const creditsToAdd = parseInt(metadata.credits || "0");
    const amountTotal = (session.amount_total || 0) / 100;

    if (!userId || !packId) {
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

    try {
      if (userId && creditsToAdd > 0) {
        const { error } = await supabaseAdmin.rpc("increment_credits", {
          target_user_id: userId,
          amount: creditsToAdd,
        });

        if (error) {
          console.error(t("errors.rpcError"), error);
          throw error;
        }

        await supabaseAdmin
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);

        console.log(t("logs.userCredited", { userId, credits: creditsToAdd }));

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("referred_by, referral_reward_paid")
          .eq("id", userId)
          .single();

        if (profile?.referred_by && !profile.referral_reward_paid) {
          await supabaseAdmin.rpc("increment_credits", {
            target_user_id: profile.referred_by,
            amount: 10,
          });
          await supabaseAdmin.rpc("increment_referral_credits", {
            target_user_id: profile.referred_by,
            amount: 10,
          });
          await supabaseAdmin
            .from("profiles")
            .update({ referral_reward_paid: true })
            .eq("id", userId);
          console.log(
            t("logs.referralBonus", { userId: profile.referred_by, credits: 10 }),
          );
        }
      } else {
        console.warn(t("warnings.invalidMetadata"));
      }
    } catch (err: any) {
      console.error(t("errors.dbUpdateFailed", { message: err.message }));
      return NextResponse.json(
        { error: t("responses.dbUpdateFailed") },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

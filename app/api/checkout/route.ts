import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getApiTranslations } from "@/lib/api-i18n";
import { getPriceForCurrency, type PackId } from "@/lib/config/pricing";

const OTO_DURATION_MS = 24 * 60 * 60 * 1000;
const OTO_COUPONS: Record<string, string> = {
  discovery: process.env.STRIPE_OTO_COUPON_DISCOVERY || "",
  studio: process.env.STRIPE_OTO_COUPON_STUDIO || "",
};

export async function POST(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.Checkout");
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    console.error(t("errors.missingStripeKey"));
    return NextResponse.json(
      { error: t("responses.missingStripeKey") },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-12-15.clover",
  });

  try {
    const { packId, userId, currency, isOTO, locale: clientLocale } = await request.json();
    const locale = clientLocale || "en";
    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

    console.log(t("logs.request", { packId, userId, origin }));

    if (!userId) {
      console.error(t("errors.missingUserId"));
      return NextResponse.json(
        { error: t("responses.userIdRequired") },
        { status: 400 },
      );
    }

    // OTO packs use the same Stripe prices but with a coupon applied
    const otoPackMapping: Record<string, string> = {
      oto_discovery: "discovery",
      oto_studio: "studio",
    };

    const resolvedPackId = otoPackMapping[packId] || packId;
    const isOTOPack = packId in otoPackMapping || isOTO;

    // Validate pack and currency using central config
    const validPackIds = ["discovery", "creator", "studio"];
    if (!validPackIds.includes(resolvedPackId)) {
      console.error(t("errors.invalidPack", { packId }));
      return NextResponse.json(
        { error: t("responses.invalidPack") },
        { status: 400 },
      );
    }

    const selectedPack = getPriceForCurrency(resolvedPackId as PackId, currency || "USD");

    // Validate OTO eligibility server-side
    let otoCouponId = "";
    const packCoupon = OTO_COUPONS[resolvedPackId] || "";
    if (isOTOPack && packCoupon) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } },
      );
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("special_offer_started_at")
        .eq("id", userId)
        .single();

      if (profile?.special_offer_started_at) {
        const start = new Date(profile.special_offer_started_at).getTime();
        if (Date.now() - start < OTO_DURATION_MS) {
          otoCouponId = packCoupon;
        }
      }
    }

    console.log(
      t("logs.selectedPack", {
        packId,
        priceId: selectedPack.priceId,
        credits: selectedPack.credits,
      }),
    );

    // Map app locales to Stripe-supported locale codes
    const stripeLocaleMap: Record<string, string> = {
      fr: "fr", en: "en", es: "es", de: "de", ja: "ja", zh: "zh",
    };
    const stripeLocale = stripeLocaleMap[locale] || "auto";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: selectedPack.priceId as string,
          quantity: 1,
        },
      ],
      mode: "payment",
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams["locale"],
      success_url: `${origin}/${locale}/studio?success=true`,
      cancel_url: `${origin}/${locale}/pricing?canceled=true`,
      metadata: {
        userId,
        packId: resolvedPackId,
        credits: selectedPack.credits.toString(),
      },
    };

    if (otoCouponId) {
      sessionParams.discounts = [{ coupon: otoCouponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(t("logs.sessionCreated", { sessionId: session.id }));
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error(t("errors.stripeError", { message: err.message }));
    return NextResponse.json(
      { error: t("responses.paymentInitFailed") },
      { status: 500 },
    );
  }
}

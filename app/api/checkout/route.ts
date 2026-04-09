import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getApiTranslations } from "@/lib/api-i18n";
import {
  getPriceForCurrency,
  getOTOPriceForCurrency,
  isOTOEligible,
  STRIPE_PRODUCTS,
  type PackId,
} from "@/lib/config/pricing";

const OTO_DURATION_MS = 24 * 60 * 60 * 1000;

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

    // OTO packs use the same base pack but with inline OTO pricing
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

    // Fetch user email for Stripe checkout pre-fill and confirmation email
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    let userEmail: string | undefined;
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      userEmail = authUser?.user?.email || undefined;
    } catch {
      console.warn("[Checkout] Could not fetch user email");
    }

    // Validate OTO eligibility server-side
    let useOTOPricing = false;
    if (isOTOPack && isOTOEligible(resolvedPackId as PackId)) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("special_offer_started_at")
        .eq("id", userId)
        .single();

      if (profile?.special_offer_started_at) {
        const start = new Date(profile.special_offer_started_at).getTime();
        if (Date.now() - start < OTO_DURATION_MS) {
          useOTOPricing = true;
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

    // Build line_items: use inline price_data for OTO, or existing Stripe price
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (useOTOPricing) {
      const otoPrice = getOTOPriceForCurrency(resolvedPackId as PackId, currency || "USD");
      if (!otoPrice) {
        return NextResponse.json(
          { error: t("responses.invalidPack") },
          { status: 400 },
        );
      }
      // Convert amount to smallest currency unit (cents, yen, etc.)
      const currencyCode = otoPrice.currency.toLowerCase();
      const unitAmount = currencyCode === "jpy" || currencyCode === "cny"
        ? Math.round(otoPrice.amount)
        : Math.round(otoPrice.amount * 100);

      lineItems = [
        {
          price_data: {
            currency: currencyCode,
            product: STRIPE_PRODUCTS[resolvedPackId as PackId],
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ];
      console.log(`[Checkout] OTO pricing applied: ${otoPrice.amount} ${otoPrice.currency} for ${resolvedPackId}`);
    } else {
      lineItems = [
        {
          price: selectedPack.priceId as string,
          quantity: 1,
        },
      ];
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams["locale"],
      success_url: `${origin}/${locale}/studio?success=true`,
      cancel_url: `${origin}/${locale}/pricing?canceled=true`,
      metadata: {
        userId,
        packId: resolvedPackId,
        credits: selectedPack.credits.toString(),
        locale,
        userEmail: userEmail || "",
        isOTO: useOTOPricing ? "true" : "false",
      },
      ...(userEmail ? { customer_email: userEmail } : {}),
    };

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

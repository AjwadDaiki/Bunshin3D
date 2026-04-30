import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getApiTranslations } from "@/lib/api-i18n";
import { getPriceForCurrency, type PackId } from "@/lib/config/pricing";

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
    const { packId, userId, currency, locale: clientLocale } = await request.json();
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

    const validPackIds = ["discovery", "creator", "studio"];
    if (!validPackIds.includes(packId)) {
      console.error(t("errors.invalidPack", { packId }));
      return NextResponse.json(
        { error: t("responses.invalidPack") },
        { status: 400 },
      );
    }

    const selectedPack = getPriceForCurrency(packId as PackId, currency || "USD");

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
        packId,
        credits: selectedPack.credits.toString(),
        locale,
        userEmail: userEmail || "",
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

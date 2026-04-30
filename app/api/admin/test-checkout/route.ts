import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { PRICING_CONFIG, type PackId } from "@/lib/config/pricing";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const testKey = process.env.STRIPE_TEST_SECRET_KEY || "";
  if (!testKey) {
    return NextResponse.json(
      { error: "STRIPE_TEST_SECRET_KEY not configured" },
      { status: 500 },
    );
  }


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }


  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }


  const { packId, targetUserId, locale: clientLocale } = await request.json();
  const locale = clientLocale || "en";
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const validPacks = Object.keys(PRICING_CONFIG);
  if (!validPacks.includes(packId)) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const userId = targetUserId || user.id;
  const pack = PRICING_CONFIG[packId as PackId];


  const refPrice = pack.prices.EUR;


  const stripe = new Stripe(testKey, { apiVersion: "2025-12-15.clover" });

  const stripeLocaleMap: Record<string, string> = {
    fr: "fr", en: "en", es: "es", de: "de", ja: "ja", zh: "zh",
  };

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `[TEST] ${packId.charAt(0).toUpperCase() + packId.slice(1)} Pack - ${pack.credits} credits`,
          },
          unit_amount: Math.round(refPrice.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    locale: (stripeLocaleMap[locale] || "auto") as Stripe.Checkout.SessionCreateParams["locale"],
    success_url: `${origin}/${locale}/admin?test_success=true`,
    cancel_url: `${origin}/${locale}/admin?test_canceled=true`,
    metadata: {
      userId,
      packId,
      credits: pack.credits.toString(),
      locale,
      userEmail: user.email || "",
      isTestPayment: "true",
    },
    ...(user.email ? { customer_email: user.email } : {}),
  });

  console.log(`[Admin] Test checkout created: session=${session.id} pack=${packId} target=${userId}`);

  return NextResponse.json({ url: session.url });
}

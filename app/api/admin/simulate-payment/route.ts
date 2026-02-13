import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { sendPaymentConfirmationEmail } from "@/lib/email";
import { PRICING_CONFIG, type PackId } from "@/lib/config/pricing";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1. Authenticate the requesting user via cookies
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

  // 2. Check admin role
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

  // 3. Parse request body
  const { targetUserId, packId, sendEmail } = await request.json();

  if (!targetUserId || !packId) {
    return NextResponse.json(
      { error: "Missing targetUserId or packId" },
      { status: 400 },
    );
  }

  const validPacks = Object.keys(PRICING_CONFIG);
  if (!validPacks.includes(packId)) {
    return NextResponse.json(
      { error: `Invalid packId. Valid: ${validPacks.join(", ")}` },
      { status: 400 },
    );
  }

  const pack = PRICING_CONFIG[packId as PackId];
  const creditsToAdd = pack.credits;

  // 4. Verify target user exists
  const { data: targetProfile, error: targetError } = await supabaseAdmin
    .from("profiles")
    .select("credits, email")
    .eq("id", targetUserId)
    .single();

  if (targetError || !targetProfile) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  // 5. Add credits
  const { error: rpcError } = await supabaseAdmin.rpc("increment_credits", {
    target_user_id: targetUserId,
    amount: creditsToAdd,
  });

  if (rpcError) {
    // Fallback to direct update
    const newCredits = (targetProfile.credits || 0) + creditsToAdd;
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", targetUserId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to add credits" },
        { status: 500 },
      );
    }
  }

  console.log(
    `[Admin] Simulated payment: admin=${user.id} target=${targetUserId} pack=${packId} credits=+${creditsToAdd}`,
  );

  // 6. Optionally send confirmation email
  if (sendEmail && targetProfile.email) {
    try {
      // Fetch user's locale preference
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
      const locale = authUser?.user?.user_metadata?.locale || "en";

      await sendPaymentConfirmationEmail({
        email: targetProfile.email,
        locale,
        credits: creditsToAdd,
        packId,
        amount: 0,
        currency: "USD",
      });
    } catch (err) {
      console.warn("[Admin] Failed to send confirmation email:", err);
    }
  }

  return NextResponse.json({
    success: true,
    creditsAdded: creditsToAdd,
    newTotal: (targetProfile.credits || 0) + creditsToAdd,
  });
}

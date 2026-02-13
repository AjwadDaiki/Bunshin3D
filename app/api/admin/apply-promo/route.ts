import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const OTO_DURATION_MS = 24 * 60 * 60 * 1000; // 24h — must match useSpecialOffer.ts

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1. Authenticate
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

  // 2. Check admin
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

  // 3. Parse request
  const { targetUserId, durationHours, remove } = await request.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
  }

  // 4. Verify target user exists
  const { data: targetProfile, error: targetError } = await supabaseAdmin
    .from("profiles")
    .select("special_offer_started_at")
    .eq("id", targetUserId)
    .single();

  if (targetError || !targetProfile) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  // 5. Apply or remove promotion
  if (remove) {
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ special_offer_started_at: null })
      .eq("id", targetUserId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to remove promotion" }, { status: 500 });
    }

    console.log(`[Admin] Promotion removed: admin=${user.id} target=${targetUserId}`);
    return NextResponse.json({ success: true, removed: true });
  }

  // Calculate special_offer_started_at so that (now - started_at) stays < 24h
  // for exactly durationHours from now.
  // The check is: Date.now() - start < OTO_DURATION_MS (24h)
  // We want: (Date.now() + durationHours*3600*1000) - start = OTO_DURATION_MS
  // So: start = Date.now() + durationHours*3600*1000 - OTO_DURATION_MS
  // For 24h: start = now (normal)
  // For 48h: start = now + 24h (future timestamp, difference is negative, < 24h)
  // For 72h: start = now + 48h
  const hours = Number(durationHours) || 24;
  const startedAt = new Date(Date.now() + hours * 3600 * 1000 - OTO_DURATION_MS);

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ special_offer_started_at: startedAt.toISOString() })
    .eq("id", targetUserId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to apply promotion" }, { status: 500 });
  }

  console.log(
    `[Admin] Promotion applied: admin=${user.id} target=${targetUserId} duration=${hours}h started_at=${startedAt.toISOString()}`,
  );

  return NextResponse.json({
    success: true,
    durationHours: hours,
    startedAt: startedAt.toISOString(),
  });
}

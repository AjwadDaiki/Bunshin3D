import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/admin-client";

export async function POST(request: NextRequest) {
  try {
    const { userId, referralCode: rawCode } = await request.json();

    if (!userId || !rawCode) {
      return NextResponse.json({ ok: true });
    }

    const referralCode = String(rawCode).trim().toUpperCase();
    if (!referralCode) {
      return NextResponse.json({ ok: true });
    }

    const adminClient = await createAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("id, referred_by")
      .eq("id", userId)
      .single();

    if (!profile || profile.referred_by) {
      return NextResponse.json({ ok: true });
    }

    const { data: referrer } = await adminClient
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (referrer?.id && referrer.id !== userId) {
      await adminClient
        .from("profiles")
        .update({ referred_by: referrer.id })
        .eq("id", userId);

      await adminClient.rpc("increment_credits", {
        amount: 2,
        target_user_id: referrer.id,
      });

      await adminClient.rpc("increment_referral_credits", {
        amount: 2,
        target_user_id: referrer.id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

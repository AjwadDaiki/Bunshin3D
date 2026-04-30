import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NURTURE_SEQUENCE, POST_PURCHASE_SEQUENCE, CREDIT_LOW_EMAIL } from "@/lib/email-sequences";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

async function sendEmailToUser(
  resend: Resend,
  supabase: any,
  user: any,
  step: any,
) {
  const sentEmails: string[] = user.nurture_emails_sent || [];
  if (sentEmails.includes(step.id)) return false;

  const locale = user.locale || "en";
  const subject = step.subject[locale] || step.subject.en;

  await resend.emails.send({
    from: "Bunshin 3D <noreply@bunshin3d.com>",
    to: user.email,
    subject,
    html: step.getHtml({
      locale,
      credits: user.credits || 0,
      studioUrl: `${APP_URL}/${locale}/studio`,
      pricingUrl: `${APP_URL}/${locale}/pricing`,
    }),
  });

  await supabase
    .from("profiles")
    .update({ nurture_emails_sent: [...sentEmails, step.id] })
    .eq("id", user.id);

  return true;
}

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let sent = 0;


    for (const step of NURTURE_SEQUENCE) {
      if (step.delayDays === 0) continue;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - step.delayDays);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const { data: users } = await supabase
        .from("profiles")
        .select("id, email, credits, locale, nurture_emails_sent")
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString())
        .eq("has_purchased", false);

      if (!users) continue;

      for (const user of users) {
        if (!user.email) continue;
        try {
          if (await sendEmailToUser(resend, supabase, user, step)) sent++;
        } catch (e) {
          console.error(`Failed nurture ${step.id} to ${user.email}:`, e);
        }
      }
    }


    for (const step of POST_PURCHASE_SEQUENCE) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - step.delayDays);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const { data: users } = await supabase
        .from("profiles")
        .select("id, email, credits, locale, nurture_emails_sent, first_purchase_at, last_pack_purchased")
        .gte("first_purchase_at", dayStart.toISOString())
        .lte("first_purchase_at", dayEnd.toISOString())
        .eq("last_pack_purchased", "discovery");

      if (!users) continue;

      for (const user of users) {
        if (!user.email) continue;
        try {
          if (await sendEmailToUser(resend, supabase, user, step)) sent++;
        } catch (e) {
          console.error(`Failed upsell ${step.id} to ${user.email}:`, e);
        }
      }
    }


    {
      const { data: lowCreditUsers } = await supabase
        .from("profiles")
        .select("id, email, credits, locale, nurture_emails_sent")
        .lte("credits", 1)
        .gt("credits", -1);

      if (lowCreditUsers) {
        for (const user of lowCreditUsers) {
          if (!user.email) continue;
          try {
            if (await sendEmailToUser(resend, supabase, user, CREDIT_LOW_EMAIL)) sent++;
          } catch (e) {
            console.error(`Failed credit-low to ${user.email}:`, e);
          }
        }
      }
    }

    return NextResponse.json({ sent });
  } catch (error: any) {
    console.error("Nurture cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

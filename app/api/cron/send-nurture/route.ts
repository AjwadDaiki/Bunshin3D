import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NURTURE_SEQUENCE } from "@/lib/email-sequences";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let sent = 0;
    let skipped = 0;

    for (const step of NURTURE_SEQUENCE) {
      // Skip welcome email (sent on signup, not by cron)
      if (step.delayDays === 0) continue;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - step.delayDays);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Find users who signed up exactly `delayDays` ago and haven't received this email
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, email, credits, locale, nurture_emails_sent")
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString())
        .eq("has_purchased", false); // Only target non-payers

      if (error || !users) continue;

      for (const user of users) {
        if (!user.email) continue;

        // Check if this step was already sent
        const sentEmails: string[] = user.nurture_emails_sent || [];
        if (sentEmails.includes(step.id)) {
          skipped++;
          continue;
        }

        const locale = user.locale || "en";
        const subject = step.subject[locale] || step.subject.en;

        try {
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

          // Mark as sent
          await supabase
            .from("profiles")
            .update({
              nurture_emails_sent: [...sentEmails, step.id],
            })
            .eq("id", user.id);

          sent++;
        } catch (emailError) {
          console.error(`Failed to send ${step.id} to ${user.email}:`, emailError);
        }
      }
    }

    return NextResponse.json({ sent, skipped });
  } catch (error: any) {
    console.error("Nurture cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

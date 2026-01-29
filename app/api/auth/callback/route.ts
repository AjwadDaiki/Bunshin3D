import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/admin-client";
import { getApiTranslations } from "@/lib/api-i18n";

export const runtime = "nodejs";
export const maxDuration = 300;

function detectLocaleFromNext(nextPath: string): string {
  const match = nextPath.match(/^\/([a-z]{2})(\/|$)/);
  return match?.[1] ?? "fr";
}

function ensureLocaleInNext(nextPath: string, locale: string): string {
  if (nextPath === "/") return `/${locale}`;
  if (nextPath.startsWith(`/${locale}/`) || nextPath === `/${locale}`) return nextPath;
  if (/^\/[a-z]{2}(\/|$)/.test(nextPath)) return nextPath;
  return `/${locale}${nextPath.startsWith("/") ? "" : "/"}${nextPath}`;
}

export async function GET(request: NextRequest) {
  const t = await getApiTranslations(request, "Api.Auth");
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const refParam = requestUrl.searchParams.get("ref");
  let next = requestUrl.searchParams.get("next") || "/studio";

  if (!next.startsWith("/")) next = "/studio";

  const locale = detectLocaleFromNext(next);
  next = ensureLocaleInNext(next, locale);

  if (!code) {
    console.error(t("errors.missingCode"));
    return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=no_code`);
  }

  let response = NextResponse.redirect(`${requestUrl.origin}${next}`);
  response.headers.set("Cache-Control", "no-store, max-age=0");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              path: options?.path || "/",
              httpOnly: options?.httpOnly ?? false,
              secure: process.env.NODE_ENV === "production",
              sameSite:
                (options?.sameSite as "lax" | "strict" | "none" | undefined) ||
                "lax",
            };
            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(t("errors.exchangeFailed", { message: error.message }));
    return NextResponse.redirect(
      `${requestUrl.origin}/${locale}/login?error=auth_failed&msg=${encodeURIComponent(error.message)}`,
    );
  }

  if (!data?.session) {
    console.error(t("errors.noSession"));
    return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=no_session`);
  }

  const adminClient = await createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("id, is_banned, referred_by")
    .eq("id", data.user.id)
    .single();

  if (profile?.is_banned) {
    response = NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=banned`);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    await supabase.auth.signOut();
    return response;
  }

  const referralCode = refParam?.trim().toUpperCase();

  if (referralCode && profile && !profile.referred_by) {
    const { data: referrer } = await adminClient
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (referrer?.id && referrer.id !== data.user.id) {
      await adminClient
        .from("profiles")
        .update({ referred_by: referrer.id })
        .eq("id", data.user.id);

      await adminClient.rpc("increment_credits", {
        amount: 2,
        target_user_id: referrer.id,
      });

      await adminClient.rpc("increment_referral_credits", {
        amount: 2,
        target_user_id: referrer.id,
      });
    }
  }

  return response;
}

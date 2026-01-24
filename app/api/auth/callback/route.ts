import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const maxDuration = 300;

function detectLocaleFromNext(nextPath: string): string {
  const m = nextPath.match(/^\/([a-z]{2})(\/|$)/);
  return m?.[1] ?? "fr";
}

function ensureLocaleInNext(nextPath: string, locale: string): string {
  if (nextPath === "/") return `/${locale}`;
  if (nextPath.startsWith(`/${locale}/`) || nextPath === `/${locale}`) return nextPath;
  if (/^\/[a-z]{2}(\/|$)/.test(nextPath)) return nextPath;
  return `/${locale}${nextPath.startsWith("/") ? "" : "/"}${nextPath}`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let next = url.searchParams.get("next") ?? "/studio";

  if (!next.startsWith("/")) next = "/studio";

  const baseUrl = request.nextUrl.origin;
  const locale = detectLocaleFromNext(next);
  next = ensureLocaleInNext(next, locale);

  if (!code) {
    console.error("❌ Code OAuth manquant");
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=missing_code`);
  }

  console.log("🔄 OAuth callback - code reçu");

  // IMPORTANT: Create the redirect response BEFORE Supabase writes cookies
  const redirectResponse = NextResponse.redirect(`${baseUrl}${next}`);
  redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log(`📝 Setting ${cookiesToSet.length} cookies`);
          
          cookiesToSet.forEach(({ name, value, options }) => {
            // CRITICAL: Use the exact options from Supabase, but ensure they work in production
            const finalOptions = {
              ...options,
              path: options?.path || "/",
              // Never force httpOnly - let Supabase decide
              httpOnly: options?.httpOnly ?? false,
              secure: process.env.NODE_ENV === "production",
              sameSite: (options?.sameSite as "lax" | "strict" | "none" | undefined) || "lax",
            };

            console.log(`🍪 Cookie: ${name}, httpOnly: ${finalOptions.httpOnly}, secure: ${finalOptions.secure}, sameSite: ${finalOptions.sameSite}`);
            
            redirectResponse.cookies.set(name, value, finalOptions);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=auth_failed`);
  }

  if (!data.session) {
    console.error("❌ No session created");
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=no_session`);
  }

  console.log("✅ Session created:", data.user?.email);
  console.log("✅ Session expires:", new Date(data.session.expires_at! * 1000).toISOString());
  console.log("✅ Cookies set:", redirectResponse.cookies.getAll().map(c => c.name));

  return redirectResponse;
}

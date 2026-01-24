import { NextRequest, NextResponse } from "next/server";
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
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let next = requestUrl.searchParams.get("next") || "/studio";

  // Security: prevent open redirects
  if (!next.startsWith("/")) next = "/studio";

  const locale = detectLocaleFromNext(next);
  next = ensureLocaleInNext(next, locale);

  console.log("🔵 OAuth Callback Started");
  console.log("   - Code:", code ? `${code.substring(0, 20)}...` : "MISSING");
  console.log("   - Next:", next);
  console.log("   - Locale:", locale);

  if (!code) {
    console.error("❌ No OAuth code provided");
    return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=no_code`);
  }

  // Create redirect response that will include cookies
  const response = NextResponse.redirect(`${requestUrl.origin}${next}`);
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
          console.log(`📝 Supabase setting ${cookiesToSet.length} cookies`);
          
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`🍪 Cookie: ${name}`);
            console.log(`   - httpOnly: ${options?.httpOnly}`);
            console.log(`   - secure: ${options?.secure}`);
            console.log(`   - sameSite: ${options?.sameSite}`);
            console.log(`   - path: ${options?.path}`);
            console.log(`   - maxAge: ${options?.maxAge}`);
            
            // Use the options from Supabase but ensure they work in production
            const cookieOptions = {
              ...options,
              path: options?.path || "/",
              httpOnly: options?.httpOnly ?? false,
              secure: process.env.NODE_ENV === "production",
              sameSite: (options?.sameSite as "lax" | "strict" | "none" | undefined) || "lax",
            };

            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  console.log("🔄 Exchanging OAuth code for session...");
  
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession ERROR:");
    console.error("   - Message:", error.message);
    console.error("   - Status:", error.status);
    console.error("   - Code:", error.code);
    return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=auth_failed&msg=${encodeURIComponent(error.message)}`);
  }

  if (!data?.session) {
    console.error("❌ No session created");
    console.error("   - Data:", JSON.stringify(data));
    return NextResponse.redirect(`${requestUrl.origin}/${locale}/login?error=no_session`);
  }

  console.log("✅ Session created successfully!");
  console.log("   - User:", data.user.email);
  console.log("   - User ID:", data.user.id);
  console.log("   - Expires:", new Date(data.session.expires_at! * 1000).toISOString());
  console.log("   - Access token (first 30 chars):", data.session.access_token.substring(0, 30));
  console.log("   - Refresh token exists:", !!data.session.refresh_token);

  const cookiesSet = response.cookies.getAll();
  console.log("✅ Cookies in response:", cookiesSet.map(c => ({
    name: c.name,
    hasValue: !!c.value,
    valueLength: c.value?.length || 0,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: c.sameSite
  })));

  console.log(`✅ Redirecting to: ${next}`);
  
  return response;
}

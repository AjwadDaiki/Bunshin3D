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

  console.log("🔄 Début échange code OAuth pour session");

  // CRITICAL: Create response object that will be returned
  let response = NextResponse.redirect(`${baseUrl}${next}`);
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log("📝 Écriture de", cookiesToSet.length, "cookies");
          cookiesToSet.forEach(({ name, value, options }) => {
            // CRITICAL: Don't force httpOnly or the browser can't read session
            const finalOptions = {
              ...options,
              path: "/",
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
            };

            console.log("🍪 Set cookie:", name, "httpOnly:", finalOptions.httpOnly);
            response.cookies.set(name, value, finalOptions);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=auth_failed`);
  }

  if (!data.session) {
    console.error("❌ Session non créée");
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=no_session`);
  }

  console.log("✅ Session créée pour:", data.user?.email);
  console.log("✅ Access token (premiers chars):", data.session.access_token.substring(0, 20));
  
  const allCookies = response.cookies.getAll();
  console.log("✅ Cookies dans response:", allCookies.map(c => ({
    name: c.name,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: c.sameSite,
    hasValue: !!c.value
  })));

  // Add cache headers
  response.headers.set("Cache-Control", "no-store, max-age=0");
  
  return response;
}

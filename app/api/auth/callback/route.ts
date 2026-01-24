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

  // Security: prevent open redirects
  if (!next.startsWith("/")) next = "/studio";

  const baseUrl = request.nextUrl.origin;

  const locale = detectLocaleFromNext(next);
  next = ensureLocaleInNext(next, locale);

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=missing_code`);
  }

  // Create redirect response FIRST so Supabase can write cookies on it.
  const response = NextResponse.redirect(`${baseUrl}${next}`);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");

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
              path: options?.path ?? "/",
              secure: options?.secure ?? (process.env.NODE_ENV === "production"),
              sameSite: (options?.sameSite as "lax" | "strict" | "none") ?? "lax",
              httpOnly: options?.httpOnly ?? false,
            };

            // If SameSite=None, Secure must be true (required by browsers)
            if (cookieOptions.sameSite === "none") {
              cookieOptions.secure = true;
            }

            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession error:", error);
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=auth_code_error`);
  }

  if (!data.session) {
    console.error("❌ Session non créée après exchangeCodeForSession");
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=no_session`);
  }

  console.log("✅ Session créée pour:", data.user?.email);
  console.log("✅ Cookies écrits:", response.cookies.getAll().map((c) => c.name));

  return response;
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function getLocaleAndCleanPath(pathname: string) {
  // Detect /fr/... or /en/...
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Strip locale prefix
  const cleanPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  return { locale, cleanPath };
}

/**
 * When we need to redirect from middleware, we MUST keep any Set-Cookie that
 * Supabase (or next-intl) may have added to the current `response`.
 * Otherwise, you get classic OAuth "login loop" problems.
 */
function redirectWithCookies(
  baseResponse: NextResponse,
  request: NextRequest,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  const redirectResponse = NextResponse.redirect(url);

  // Copy cookies that were already set on the base response
  // (e.g. refreshed session cookies from Supabase).
  for (const c of baseResponse.cookies.getAll()) {
    // `c` already contains name/value + options
    redirectResponse.cookies.set(c);
  }

  // Copy relevant headers from base response (rare but helpful)
  // Note: NextResponse stores some internal headers used for rewrites/intl.
  for (const [k, v] of baseResponse.headers.entries()) {
    // Don't overwrite Location set by redirect
    if (k.toLowerCase() === "location") continue;
    redirectResponse.headers.set(k, v);
  }

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  /**
   * 1) Apply next-intl first (it may rewrite/redirect to add locale)
   * 2) Create ONE response object that Supabase can write cookies onto
   * 3) If we redirect, we MUST re-attach those cookies onto the redirect response
   */
  let response = intlMiddleware(request) as NextResponse | undefined;

  if (!response) {
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  const pathname = request.nextUrl.pathname;
  const { locale, cleanPath } = getLocaleAndCleanPath(pathname);

  // ⚠️ CRITICAL: Skip auth validation for OAuth callback routes
  // Otherwise the middleware interferes with session creation
  const isAuthCallback = cleanPath.startsWith("/auth/callback");
  if (isAuthCallback) {
    console.log("🔄 Auth callback detected, skipping middleware validation");
    return response;
  }

  // Create the Supabase server client with cookie read/write
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // In middleware, request cookies are effectively read-only.
          // Only set them on the RESPONSE.
          cookiesToSet.forEach(({ name, value, options }) => {
            response!.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Prefer getUser() to validate the JWT against Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Minimal debug log (keep it, it's useful in prod)
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const hasSessionCookie = cookieNames.some((name) => name.startsWith("sb-"));

  console.log("🔐 Middleware check:", {
    path: pathname,
    cleanPath,
    locale,
    hasSessionCookie,
    userEmail: user?.email,
    error: error?.message,
  });

  const isLoggedIn = !!user && !error;

  // Public routes + auth routes (do NOT block OAuth callback)
  const publicRoutes = ["/", "/login", "/pricing"];

  const isPublicRoute = publicRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );

  // Allow important public files / PWA assets
  const isWellKnownPublicAsset = [
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
  ].includes(cleanPath);

  if (isWellKnownPublicAsset) {
    return response;
  }

  // Redirect to login if not connected and route is protected
  if (!isLoggedIn && !isPublicRoute) {
    console.log("❌ Non authentifié, redirect vers login");
    return redirectWithCookies(response, request, `/${locale}/login`);
  }

  // Redirect to studio if connected and visiting login
  if (isLoggedIn && cleanPath === "/login") {
    console.log("✅ Déjà authentifié, redirect vers studio");
    return redirectWithCookies(response, request, `/${locale}/studio`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - common public files / assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl|css|js|map)$).*)",
  ],
};

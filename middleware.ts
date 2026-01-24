import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const defaultLocale = "fr";
const locales = ["fr", "en"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // CRITICAL: Skip auth callback completely to avoid cookie interference
  if (pathname.includes("/api/auth/callback")) {
    console.log("🔄 Skipping middleware for OAuth callback");
    return NextResponse.next();
  }

  // Check if pathname is missing a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect to default locale if no locale in path
  if (!pathnameHasLocale && !pathname.startsWith("/api") && pathname !== "/" && !pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Redirect root to default locale
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // Create response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Detect locale from path
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;
  const cleanPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  // Create Supabase client
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
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();

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
  const publicRoutes = ["/", "/login", "/pricing", "/terms", "/privacy", "/legal-mentions"];
  const isPublicRoute = publicRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );

  const isWellKnownPublicAsset = [
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
  ].includes(cleanPath);

  if (isWellKnownPublicAsset) {
    return response;
  }

  // Redirect logic
  if (!isLoggedIn && !isPublicRoute) {
    console.log("❌ Non authentifié, redirect vers login");
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    const redirectResponse = NextResponse.redirect(url);
    
    // Copy cookies from base response
    for (const c of response.cookies.getAll()) {
      redirectResponse.cookies.set(c);
    }
    return redirectResponse;
  }

  if (isLoggedIn && cleanPath === "/login") {
    console.log("✅ Déjà authentifié, redirect vers studio");
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/studio`;
    const redirectResponse = NextResponse.redirect(url);
    
    // Copy cookies from base response
    for (const c of response.cookies.getAll()) {
      redirectResponse.cookies.set(c);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl|css|js|map)$).*)",
  ],
};

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function getLocaleAndCleanPath(pathname: string) {
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const cleanPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  return { locale, cleanPath };
}

function redirectWithCookies(
  baseResponse: NextResponse,
  request: NextRequest,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirectResponse = NextResponse.redirect(url);

  for (const c of baseResponse.cookies.getAll()) {
    redirectResponse.cookies.set(c);
  }

  for (const [k, v] of baseResponse.headers.entries()) {
    if (k.toLowerCase() === "location") continue;
    redirectResponse.headers.set(k, v);
  }

  return redirectResponse;
}

export async function middleware(request: NextRequest) {
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

  const publicRoutes = ["/", "/login", "/pricing"];

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

  if (!isLoggedIn && !isPublicRoute) {
    console.log("❌ Non authentifié, redirect vers login");
    return redirectWithCookies(response, request, `/${locale}/login`);
  }

  if (isLoggedIn && cleanPath === "/login") {
    console.log("✅ Déjà authentifié, redirect vers studio");
    return redirectWithCookies(response, request, `/${locale}/studio`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl|css|js|map)$).*)",
  ],
};

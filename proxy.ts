import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;


  if (pathname.includes("/api/auth/callback")) {
    return NextResponse.next();
  }


  let response = handleI18nRouting(request);


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });


          response = NextResponse.next({
            request,
            headers: response.headers,
          });


          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              httpOnly: false,
            });
          });
        },
      },
    },
  );


  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();


  if (response.status === 307 || response.status === 308) {
    return response;
  }

  const isLoggedIn = !!user && !error;

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  const cleanPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  const publicRoutes = [
    "/",
    "/login",
    "/pricing",
    "/terms",
    "/privacy",
    "/legal-mentions",
  ];

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


  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;


  if (!isLoggedIn && !isPublicRoute) {
    const redirectResponse = NextResponse.redirect(
      new URL(`/${locale}/login`, appOrigin),
    );
    redirectResponse.cookies.set("NEXT_LOCALE", locale);
    return redirectResponse;
  }


  if (isLoggedIn && cleanPath === "/login") {
    const redirectResponse = NextResponse.redirect(
      new URL(`/${locale}/studio`, appOrigin),
    );
    redirectResponse.cookies.set("NEXT_LOCALE", locale);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl|css|js|map)$).*)",
  ],
};

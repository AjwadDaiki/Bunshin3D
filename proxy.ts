import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // CRITIQUE: Créer la réponse AVANT de créer le client Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Appliquer next-intl middleware
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    response = intlResponse as NextResponse;
  }

  // Créer le client Supabase avec gestion des cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Écrire les cookies sur la requête ET la réponse
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  /**
   * CRITIQUE: Utiliser getUser() au lieu de getSession()
   * getUser() fait un appel API pour vérifier le JWT, ce qui est plus fiable
   * après un OAuth redirect que getSession() qui lit juste les cookies
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Log pour debugging
  const cookieNames = request.cookies.getAll().map(c => c.name);
  const hasSessionCookie = cookieNames.some(name => name.startsWith('sb-'));
  
  console.log("🔐 Middleware check:", {
    path: request.nextUrl.pathname,
    hasSessionCookie,
    userEmail: user?.email,
    error: error?.message,
  });

  const isLoggedIn = !!user && !error;

  // ---- Protection routes (ignore locale) ----
  const pathname = request.nextUrl.pathname;

  // Détecte /fr/... ou /en/...
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Retire la locale du path
  const cleanPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  // Routes publiques + routes d'auth (important d'exclure /auth pour le callback)
  const publicRoutes = ["/", "/login"];
  const authRoutes = ["/auth"]; // Callback OAuth
  
  const isPublicRoute = publicRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );
  
  const isAuthRoute = authRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );

  // Ne pas bloquer les routes d'auth (callback OAuth)
  if (isAuthRoute) {
    return response;
  }

  // Rediriger vers login si pas connecté et route protégée
  if (!isLoggedIn && !isPublicRoute) {
    console.log("❌ Non authentifié, redirect vers login");
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Rediriger vers studio si connecté et sur login
  if (isLoggedIn && cleanPath === "/login") {
    console.log("✅ Déjà authentifié, redirect vers studio");
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/studio`;
    return NextResponse.redirect(url);
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
     * - public files (images, 3D models)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl)$).*)",
  ],
};

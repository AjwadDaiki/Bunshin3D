import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Initialisation du middleware next-intl qui gère la détection de langue
const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignorer les appels API auth callback pour ne pas interférer avec Supabase
  if (pathname.includes("/api/auth/callback")) {
    return NextResponse.next();
  }

  // 1. GESTION DE LA LANGUE (next-intl)
  // Cette fonction analyse les headers (Accept-Language) et gère :
  // - La redirection / -> /fr (ou /de, /en selon le navigateur)
  // - La redirection si la langue n'est pas dans l'URL
  const response = handleI18nRouting(request);

  // 2. CONFIGURATION SUPABASE
  // On utilise l'objet 'response' créé par next-intl pour y injecter les cookies Supabase
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
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // 3. VÉRIFICATION DE L'AUTHENTIFICATION
  // On récupère l'utilisateur pour protéger les routes
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Si next-intl a déjà décidé de rediriger (ex: de "/" vers "/fr"), on arrête ici
  // pour laisser la redirection de langue se faire avant de vérifier l'auth.
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  const isLoggedIn = !!user && !error;

  // Extraction de la locale pour construire les URLs de redirection Auth correctement
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Chemin "propre" sans la locale pour vérifier les routes protégées
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

  // Vérification si la route est publique
  const isPublicRoute = publicRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );

  // Vérification des assets publics
  const isWellKnownPublicAsset = [
    "/manifest.json",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
  ].includes(cleanPath);

  if (isWellKnownPublicAsset) {
    return response;
  }

  // LOGIQUE DE PROTECTION DES ROUTES

  // Cas 1 : Utilisateur NON connecté tentant d'accéder à une page privée
  if (!isLoggedIn && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    const redirectResponse = NextResponse.redirect(url);

    // On s'assure de copier les cookies (Supabase + next-intl)
    redirectResponse.cookies.set("NEXT_LOCALE", locale);
    return redirectResponse;
  }

  // Cas 2 : Utilisateur CONNECTÉ tentant d'accéder à la page de login
  if (isLoggedIn && cleanPath === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/studio`;
    const redirectResponse = NextResponse.redirect(url);

    // On s'assure de copier les cookies
    redirectResponse.cookies.set("NEXT_LOCALE", locale);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    // Matcher optimisé pour next-intl et Supabase
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|glb|gltf|stl|css|js|map)$).*)",
  ],
};

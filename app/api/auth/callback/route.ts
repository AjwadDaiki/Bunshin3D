import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const maxDuration = 300;

function detectLocaleFromNext(nextPath: string): string {
  // nextPath style: /fr/studio, /en/studio
  const m = nextPath.match(/^\/([a-z]{2})(\/|$)/);
  return m?.[1] ?? "fr";
}

function ensureLocaleInNext(nextPath: string, locale: string): string {
  // si next = /studio -> devient /fr/studio
  if (nextPath === "/") return `/${locale}`;
  if (nextPath.startsWith(`/${locale}/`) || nextPath === `/${locale}`) return nextPath;
  // si next commence déjà par /xx/ avec autre locale, on le laisse
  if (/^\/[a-z]{2}(\/|$)/.test(nextPath)) return nextPath;
  // sinon, on préfixe
  return `/${locale}${nextPath.startsWith("/") ? "" : "/"}${nextPath}`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let next = url.searchParams.get("next") ?? "/studio";

  // sécurité: empêche redirection externe (https://evil.com)
  if (!next.startsWith("/")) next = "/studio";

  // baseUrl = origin réel (bon pour bunshin3d.com / bunshin2.vercel.app)
  const baseUrl = request.nextUrl.origin;

  // locale cohérente basée sur next
  const locale = detectLocaleFromNext(next);
  next = ensureLocaleInNext(next, locale);

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/${locale}/login?error=missing_code`);
  }

  // CRITIQUE: Créer la réponse AVANT de créer le client Supabase
  // pour que setAll() puisse écrire les cookies dessus
  const response = NextResponse.redirect(`${baseUrl}${next}`);
  
  // Empêche la mise en cache du redirect d'auth
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
          // CRITIQUE: Écrire tous les cookies sur la réponse
          cookiesToSet.forEach(({ name, value, options }) => {
            // S'assurer que les options de cookie sont correctes pour la production
            const cookieOptions = {
              ...options,
              // Force ces options pour garantir que les cookies fonctionnent
              httpOnly: options?.httpOnly ?? true,
              secure: process.env.NODE_ENV === "production",
              sameSite: (options?.sameSite as "lax" | "strict" | "none") ?? "lax",
              path: options?.path ?? "/",
            };
            
            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    },
  );

  // Échange le code pour une session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ exchangeCodeForSession error:", error);
    return NextResponse.redirect(
      `${baseUrl}/${locale}/login?error=auth_code_error`,
    );
  }

  // Vérification supplémentaire: la session doit exister
  if (!data.session) {
    console.error("❌ Session non créée après exchangeCodeForSession");
    return NextResponse.redirect(
      `${baseUrl}/${locale}/login?error=no_session`,
    );
  }

  console.log("✅ Session créée pour:", data.user?.email);
  console.log("✅ Cookies écrits:", response.cookies.getAll().map(c => c.name));

  return response;
}

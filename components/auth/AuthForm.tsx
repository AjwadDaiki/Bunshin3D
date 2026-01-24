"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Navigation");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const supabase = createClient();

  useEffect(() => {
    // Fonction pour extraire la locale correctement
    const getLocale = () => {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      // Vérifie si le premier segment est une locale valide (fr ou en)
      const firstSegment = pathParts[0];
      if (firstSegment && /^(fr|en)$/.test(firstSegment)) {
        return firstSegment;
      }
      return "fr"; // fallback
    };

    // Vérifier si l'utilisateur est déjà connecté
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Déjà connecté, rediriger vers studio
        const locale = getLocale();
        console.log("✅ Déjà connecté, redirect vers:", `/${locale}/studio`);
        router.push(`/${locale}/studio`);
      }
    };

    checkSession();

    // Construire l'URL de callback
    const origin = window.location.origin;
    setRedirectUrl(`${origin}/api/auth/callback`);

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔐 Auth event:", event, session?.user?.email);
      
      if (event === "SIGNED_IN" && session) {
        // Rediriger vers studio après connexion
        const locale = getLocale();
        console.log("✅ Connexion réussie, redirect vers:", `/${locale}/studio`);
        router.push(`/${locale}/studio`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!redirectUrl) {
      console.error("URL de redirection non prête");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("❌ Erreur envoi magic link:", error);
      alert("Erreur lors de l'envoi du lien magique");
      setIsLoading(false);
    } else {
      console.log("✅ Magic link envoyé à:", email);
      setIsSent(true);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    if (!redirectUrl) {
      console.error("URL de redirection non prête");
      setIsLoading(false);
      return;
    }

    // Extraire la locale du path
    const locale = window.location.pathname.split("/")[1] || "fr";

    console.log("🔗 Connexion Google:", {
      redirectTo: `${redirectUrl}?next=/${locale}/studio`,
      locale,
    });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}?next=/${locale}/studio`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("❌ Erreur Auth Google:", error);
      alert("Erreur lors de la connexion avec Google");
      setIsLoading(false);
    }
    // Pas besoin de setIsLoading(false) ici car on est redirigé vers Google
  };

  if (isSent) {
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {t("checkEmail")}
        </h2>
        <p className="text-zinc-400 mb-6">{t("checkEmailDesc")}</p>
        <button
          onClick={() => setIsSent(false)}
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          Essayer un autre email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <span className="font-bold text-2xl tracking-tighter text-white">
            {tNav("brandName")}
            <span className="text-zinc-500">{tNav("brandSuffix")}</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-white">{t("title")}</h1>
        <p className="text-sm text-zinc-400 mt-2">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || !redirectUrl}
          className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 font-medium h-11 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {t("google")}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">{t("or")}</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 bg-zinc-950/50 border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-zinc-800 text-white font-medium text-sm rounded-lg hover:bg-zinc-700 transition-colors border border-white/5 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              t("magicLink")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

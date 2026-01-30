"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { routing } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

type Translator = (key: string, values?: Record<string, any>) => string;

type AuthFlowState = {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  isSent: boolean;
  errorMessage: string | null;
  resetSent: () => void;
  handleEmailLogin: (event: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
};

export function useAuthFlow(t: Translator): AuthFlowState {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const referralCode = useMemo(
    () => searchParams.get("ref")?.trim() || "",
    [searchParams],
  );

  const getLocale = useCallback(() => {
    if (typeof window === "undefined") return routing.defaultLocale;
    const segment = window.location.pathname.split("/").filter(Boolean)[0];
    return routing.locales.includes(segment as any)
      ? segment
      : routing.defaultLocale;
  }, []);

  // Server callback URL — used for magic links (PKCE flow)
  const buildCallbackUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const locale = getLocale();
    const redirectParam = searchParams.get("redirect");
    const next = redirectParam ? `/${locale}${redirectParam}` : `/${locale}/studio`;
    const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : "";
    return `${window.location.origin}/api/auth/callback?next=${next}${refParam}`;
  }, [getLocale, referralCode, searchParams]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const msgParam = searchParams.get("msg") || "";
    if (!errorParam) return;
    const errorMap: Record<string, string> = {
      no_code: t("Errors.noCode"),
      auth_failed: t("Errors.authFailed", { message: msgParam }),
      no_session: t("Errors.noSession"),
      banned: t("Errors.banned"),
    };
    setErrorMessage(errorMap[errorParam] || t("Errors.generic"));
  }, [searchParams, t]);

  useEffect(() => {
    const getRedirectUrl = () => {
      const locale = getLocale();
      const redirectParam = searchParams.get("redirect");
      return redirectParam ? `/${locale}${redirectParam}` : `/${locale}/studio`;
    };

    const processPostLogin = async (userId: string) => {
      // Process referral for OAuth logins (server callback handles this for magic links)
      const ref = referralCode || localStorage.getItem("bunshin_ref") || "";
      if (ref) {
        localStorage.removeItem("bunshin_ref");
        try {
          await fetch("/api/auth/post-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, referralCode: ref }),
          });
        } catch {
          // Non-blocking — referral failure shouldn't prevent login
        }
      }
    };

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        window.location.href = getRedirectUrl();
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        await processPostLogin(session.user.id);
        window.location.href = getRedirectUrl();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getLocale, referralCode, supabase]);

  const handleEmailLogin = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: buildCallbackUrl(),
        },
      });

      if (error) {
        console.error(t("Errors.magicLinkSend"), error);
        setErrorMessage(t("Errors.magicLinkSend"));
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      setIsLoading(false);
    },
    [buildCallbackUrl, email, supabase, t],
  );

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Store referral code before redirect so it survives the OAuth flow
    if (referralCode) {
      localStorage.setItem("bunshin_ref", referralCode);
    }

    // For OAuth: redirect back to the login page (NOT the server callback).
    // Supabase uses implicit flow for OAuth — tokens come as URL hash fragments
    // which servers can't read. The client library picks them up automatically
    // via detectSessionInUrl, and onAuthStateChange fires SIGNED_IN.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${getLocale()}/login`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(t("Errors.googleLogin"), error);
      setErrorMessage(t("Errors.googleLogin"));
      setIsLoading(false);
    }
  }, [getLocale, referralCode, supabase, t]);

  return {
    email,
    setEmail,
    isLoading,
    isSent,
    errorMessage,
    resetSent: () => setIsSent(false),
    handleEmailLogin,
    handleGoogleLogin,
  };
}

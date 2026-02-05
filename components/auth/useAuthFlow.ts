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
  const referralCode = useMemo(() => {
    const fromUrl = searchParams.get("ref")?.trim() || "";
    if (fromUrl) {
      try { localStorage.setItem("bunshin_ref", fromUrl); } catch {}
      return fromUrl;
    }
    try { return localStorage.getItem("bunshin_ref") || ""; } catch {}
    return "";
  }, [searchParams]);

  const getLocale = useCallback(() => {
    if (typeof window === "undefined") return routing.defaultLocale;
    const segment = window.location.pathname.split("/").filter(Boolean)[0];
    return routing.locales.includes(segment as any)
      ? segment
      : routing.defaultLocale;
  }, []);

  const buildCallbackUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const locale = getLocale();
    const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : "";
    return `${window.location.origin}/api/auth/callback?next=/${locale}/studio${refParam}`;
  }, [getLocale, referralCode]);

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
    let redirected = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (redirected) return;
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        redirected = true;
        try { localStorage.removeItem("bunshin_ref"); } catch {}
        const locale = getLocale();
        window.location.href = `/${locale}/studio`;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getLocale, supabase]);

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

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildCallbackUrl(),
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
  }, [buildCallbackUrl, supabase, t]);

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

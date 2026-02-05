"use client";

import { CircleNotch, Envelope } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import GoogleIcon from "./GoogleIcon";
import AuthEmailSent from "./AuthEmailSent";
import { useAuthFlow } from "./useAuthFlow";

export default function AuthForm() {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Navigation");
  const {
    email,
    setEmail,
    isLoading,
    isSent,
    errorMessage,
    resetSent,
    handleEmailLogin,
    handleGoogleLogin,
  } = useAuthFlow(t);

  if (isSent) {
    return (
      <AuthEmailSent
        title={t("checkEmail")}
        description={t("checkEmailDesc")}
        actionLabel={t("tryDifferentEmail")}
        onAction={resetSent}
      />
    );
  }

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-8">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-6">
          <span className="font-bold text-2xl tracking-tighter text-white">
            {tNav("brandName")}
            <span className="text-neutral-500">{tNav("brandSuffix")}</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-white">{t("title")}</h1>
        <p className="text-sm text-neutral-400 mt-2">{t("subtitle")}</p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#191919] border border-white/6 text-white font-medium h-11 rounded-lg hover:border-white/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
          ) : (
            <GoogleIcon className="w-4 h-4" />
          )}
          {t("google")}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/6" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111] px-2 text-neutral-500">{t("or")}</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-300 ml-1"
            >
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Envelope
                className="absolute left-3 top-3 w-4 h-4 text-neutral-500"
                weight="duotone"
              />
              <input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 bg-[#0a0a0a] border border-white/6 rounded-lg pl-10 pr-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors placeholder:text-neutral-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-white text-neutral-950 font-medium text-sm rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <CircleNotch className="w-4 h-4 animate-spin mx-auto" weight="bold" />
            ) : (
              t("magicLink")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

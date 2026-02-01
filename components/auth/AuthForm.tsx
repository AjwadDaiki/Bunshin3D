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

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 font-medium h-11 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
              <Envelope
                className="absolute left-3 top-3 w-4 h-4 text-zinc-500"
                weight="duotone"
              />
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

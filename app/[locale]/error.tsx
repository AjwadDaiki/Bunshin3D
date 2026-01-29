"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Warning, ArrowClockwise, House } from "@phosphor-icons/react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(t("logPrefix"), error);
  }, [error, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl">
          <Warning
            className="h-20 w-20 text-red-500 mx-auto mb-6"
            weight="fill"
          />

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            {t("serverErrorTitle")}
          </h1>

          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            {t("serverErrorDescription")}
          </p>

          {error.digest && (
            <div className="mb-6 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-gray-500 font-mono">
                {t("errorId", { id: error.digest })}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full text-white font-medium transition-all duration-200 hover:scale-105"
            >
              <ArrowClockwise className="h-5 w-5" weight="bold" />
              {t("tryAgain")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-brand-primary to-brand-secondary hover:opacity-90 rounded-full text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-brand-primary/25"
            >
              <House className="h-5 w-5" weight="fill" />
              {t("backHome")}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-600">{t("footer")}</p>
      </div>
    </div>
  );
}

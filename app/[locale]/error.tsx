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
    <div className="min-h-screen flex items-center justify-center relative">

      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="bg-[#111] border border-white/6 rounded-xl p-10">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#191919] border border-white/6 rounded-lg text-white font-medium hover:border-white/10 transition-colors"
            >
              <ArrowClockwise className="h-5 w-5" weight="bold" />
              {t("tryAgain")}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-neutral-950 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
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

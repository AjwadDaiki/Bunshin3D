"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1">
      <div className="text-center px-4">
        <Warning className="h-16 w-16 text-error mx-auto mb-4" weight="fill" />
        <h1 className="text-3xl font-bold mb-4">{t("serverErrorTitle")}</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {t("serverErrorDescription")}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 glass-button rounded-full hover:bg-white/15"
          >
            <ArrowClockwise className="h-5 w-5" weight="bold" />
            {t("tryAgain")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full transition-smooth"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

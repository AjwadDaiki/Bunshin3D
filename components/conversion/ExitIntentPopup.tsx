"use client";

import { useExitIntent } from "@/hooks/useExitIntent";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";

const STORAGE_KEY = "bunshin_exit_intent_shown";

export default function ExitIntentPopup() {
  const t = useTranslations("ExitIntent");
  const { triggered, reset } = useExitIntent({ delay: 5000, once: true });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    // Only show once per session
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }, [triggered]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-8 shadow-2xl animate-[scaleIn_300ms_ease-out]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {t("title")}
          </h2>

          <p className="text-sm text-neutral-400 leading-relaxed">
            {t("description")}
          </p>

          <div className="pt-2 space-y-3">
            <Link
              href="/studio"
              onClick={handleClose}
              className="flex w-full h-11 items-center justify-center rounded-lg bg-white font-semibold text-neutral-950 transition-all hover:bg-neutral-100"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/pricing"
              onClick={handleClose}
              className="flex w-full h-11 items-center justify-center rounded-lg border border-white/10 bg-white/3 font-medium text-white transition-all hover:bg-white/6"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          <p className="text-xs text-neutral-600">{t("note")}</p>
        </div>
      </div>
    </div>
  );
}

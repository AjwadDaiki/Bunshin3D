"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CopySimple } from "@phosphor-icons/react";

type Props = {
  referralCode?: string;
  referralCredits?: number;
};

export default function ReferralSection({ referralCode, referralCredits }: Props) {
  const t = useTranslations("Referral");
  const code = referralCode || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://bunshin3d.com";
  const link = code ? `${origin}/?ref=${code}` : "";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{t("title")}</h2>
        <button
          onClick={handleCopy}
          disabled={!link}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
        >
          <CopySimple className="h-4 w-4" weight="fill" />
          {copied ? t("copiedLabel") : t("copyLabel")}
        </button>
      </div>
      <div className="space-y-3 text-sm text-neutral-300">
        <div className="flex flex-col gap-2">
          <span className="text-neutral-500">{t("linkLabel")}</span>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="break-all text-blue-400 hover:text-blue-300 transition-colors"
            >
              {link}
            </a>
          ) : (
            <span className="text-neutral-500">{t("linkUnavailable")}</span>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-[#191919] border border-white/6 px-4 py-3">
          <span className="text-neutral-400">{t("creditsLabel")}</span>
          <span className="font-mono text-blue-400">
            {referralCredits ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

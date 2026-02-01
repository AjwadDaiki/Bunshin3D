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
  const link = code
    ? `https://bunshin3d.com/?ref=${code}`
    : "";
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{t("title")}</h2>
        <button
          onClick={handleCopy}
          disabled={!link}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-secondary disabled:opacity-50"
        >
          <CopySimple className="h-4 w-4" weight="fill" />
          {copied ? t("copiedLabel") : t("copyLabel")}
        </button>
      </div>
      <div className="space-y-3 text-sm text-zinc-300">
        <div className="flex flex-col gap-2">
          <span className="text-zinc-400">{t("linkLabel")}</span>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="break-all text-brand-primary hover:text-brand-secondary transition-colors"
            >
              {link}
            </a>
          ) : (
            <span className="text-zinc-500">{t("linkUnavailable")}</span>
          )}
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
          <span className="text-zinc-400">{t("creditsLabel")}</span>
          <span className="font-mono text-brand-primary">
            {referralCredits ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

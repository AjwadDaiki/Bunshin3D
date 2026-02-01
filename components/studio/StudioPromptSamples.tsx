"use client";

import { useTranslations } from "next-intl";

const SAMPLE_KEYS = ["helmet", "vase", "character", "mech"] as const;

type Props = {
  onSelect: (value: string) => void;
};

export default function StudioPromptSamples({ onSelect }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="glass-card rounded-2xl border border-white/10 bg-surface-2/60 p-5 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {t("Interface.Samples.title")}
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_KEYS.map((key) => {
          const label = t(`Interface.Samples.${key}` as const);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(label)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 hover:border-brand-primary/40 hover:text-white transition"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

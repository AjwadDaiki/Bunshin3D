"use client";

import { useTranslations } from "next-intl";

const SAMPLE_KEYS = ["helmet", "vase", "character", "mech"] as const;

type Props = {
  onSelect: (value: string) => void;
};

export default function StudioPromptSamples({ onSelect }: Props) {
  const t = useTranslations("Studio");

  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-5 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
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
              className="bg-[#191919] border border-white/6 rounded-lg px-3 py-1 text-xs text-neutral-300 hover:border-white/10 hover:text-white transition"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

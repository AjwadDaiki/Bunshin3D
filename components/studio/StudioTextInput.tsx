"use client";

import { useTranslations } from "next-intl";

type Props = {
  prompt: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export default function StudioTextInput({ prompt, onChange, disabled }: Props) {
  const t = useTranslations("Studio");

  return (
    <>
      <label className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
        {t("TextMode.promptLabel")}
      </label>
      <textarea
        value={prompt}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("TextMode.promptPlaceholder")}
        className="w-full h-40 px-4 py-3 bg-[#0a0a0a] border border-white/6 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all resize-none text-white placeholder-neutral-600"
        disabled={disabled}
      />
    </>
  );
}

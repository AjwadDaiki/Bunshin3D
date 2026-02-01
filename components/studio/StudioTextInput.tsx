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
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        {t("TextMode.promptLabel")}
      </label>
      <textarea
        value={prompt}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("TextMode.promptPlaceholder")}
        className="w-full h-40 px-4 py-3 bg-surface-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none text-white placeholder-gray-600"
        disabled={disabled}
      />
    </>
  );
}

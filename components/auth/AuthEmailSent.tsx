"use client";

import { CheckCircle } from "@phosphor-icons/react";

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export default function AuthEmailSent({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="bg-[#111] border border-white/6 rounded-xl p-8 text-center">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8" weight="fill" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-neutral-400 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="text-sm text-neutral-500 hover:text-white transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}

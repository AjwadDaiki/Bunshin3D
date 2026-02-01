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
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8" weight="fill" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-zinc-400 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="text-sm text-zinc-500 hover:text-white transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}

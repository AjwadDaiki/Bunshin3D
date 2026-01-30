"use client";

import { Check, CircleNotch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  pricePerCredit: string;
  savingsPercent: number;
  credits: string;
  description: string;
  cta: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
  isBestValue?: boolean;
  popularLabel?: string;
  bestValueLabel?: string;
  isLoading?: boolean;
  onSelect: () => void;
  isPromo?: boolean;
};

export default function PricingCard({
  id,
  title,
  price,
  originalPrice,
  pricePerCredit,
  savingsPercent,
  credits,
  description,
  cta,
  features,
  icon,
  isPopular = false,
  isBestValue = false,
  popularLabel,
  bestValueLabel,
  isLoading,
  onSelect,
  isPromo = false,
}: PricingCardProps) {
  const t = useTranslations("Pricing");

  return (
    <div
      className={cn(
        "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group",
        isPopular
          ? "bg-zinc-900/80 border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] scale-105 z-10"
          : isBestValue
            ? "bg-zinc-900/60 border-amber-500/30 hover:border-amber-500/50 hover:bg-zinc-900/70"
            : "bg-zinc-950/50 border-white/10 hover:border-white/20 hover:bg-zinc-900/50",
      )}
    >
      {/* Popular badge */}
      {isPopular && popularLabel && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full tracking-widest shadow-lg">
          {popularLabel}
        </div>
      )}

      {/* Best value badge */}
      {isBestValue && bestValueLabel && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full tracking-widest shadow-lg">
          {bestValueLabel}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center border",
            isPopular
              ? "bg-indigo-500/10 border-indigo-500/30"
              : isBestValue
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-zinc-900 border-white/5",
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-200 tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={cn("text-4xl font-bold", isPromo ? "text-emerald-400" : "text-white")}>{price}</span>
            {originalPrice && (
              <span className="text-lg text-zinc-500 line-through">{originalPrice}</span>
            )}
            <span className="text-zinc-500 font-medium">
              {t("Card.perPack")}
            </span>
          </div>

          {/* Price per credit */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-zinc-400">
              {pricePerCredit} {t("Card.perCredit")}
            </span>
            {savingsPercent > 0 && (
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  isBestValue
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400",
                )}
              >
                {t("Card.savings", { percent: savingsPercent })}
              </span>
            )}
          </div>

          <div className="text-sm font-mono text-indigo-400 mt-2 font-bold">
            {credits}
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed min-h-[40px]">
          {description}
        </p>
      </div>

      <div className="w-full h-px bg-white/5 mb-6" />

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, index) => (
          <li
            key={`${id}-${index}`}
            className="flex items-start gap-3 text-sm text-zinc-300"
          >
            <Check
              className={cn(
                "w-5 h-5 shrink-0",
                isPopular
                  ? "text-indigo-400"
                  : isBestValue
                    ? "text-amber-400"
                    : "text-zinc-500",
              )}
              weight="bold"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          "w-full h-12 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2",
          isPopular
            ? "bg-white text-black hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            : isBestValue
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              : "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5",
          isLoading && "opacity-70 cursor-not-allowed",
        )}
      >
        {isLoading && (
          <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
        )}
        {cta}
      </button>

      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl pointer-events-none" />
      )}
      {isBestValue && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl pointer-events-none" />
      )}
    </div>
  );
}

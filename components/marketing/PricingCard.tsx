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
        "group relative flex flex-col bg-[#111] rounded-xl p-8 border transition-all duration-300",
        isPopular
          ? "border-blue-500/30 md:scale-105 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10"
          : "border-white/6 hover:border-white/12 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20",
      )}
    >
      {/* Top accent line for popular card */}
      {isPopular && (
        <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      )}
      <div className="mb-6 space-y-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#191919] border border-white/6">
          {icon}
        </div>
        <div>
          {isPopular && popularLabel && (
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">{popularLabel}</span>
          )}
          {isBestValue && bestValueLabel && (
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">{bestValueLabel}</span>
          )}
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
              <span className="text-emerald-500 text-xs font-medium">
                {t("Card.savings", { percent: savingsPercent })}
              </span>
            )}
          </div>

          <div className="text-sm font-mono text-blue-500 mt-2 font-bold">
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
              className="w-5 h-5 shrink-0 text-blue-500"
              weight="bold"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="text-xs text-neutral-500 flex items-center gap-1.5 mb-6">
        <Check className="w-3.5 h-3.5" weight="bold" />
        {t("Card.securePayment")}
      </div>

      <button
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          "w-full h-12 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2",
          isPopular
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : isBestValue
              ? "bg-white text-neutral-950 hover:bg-neutral-200"
              : "bg-transparent border border-white/10 text-white hover:bg-white/5",
          isLoading && "opacity-70 cursor-not-allowed",
        )}
      >
        {isLoading && (
          <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
        )}
        {cta}
      </button>
    </div>
  );
}

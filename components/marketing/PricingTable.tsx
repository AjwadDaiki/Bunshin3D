"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Sparkles, Zap, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase";

export default function PricingTable() {
  const t = useTranslations("Pricing");
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleCheckout = async (packId: string) => {
    if (!userId) {
      alert("Veuillez vous connecter pour acheter des crédits");
      window.location.href = "/login";
      return;
    }

    setLoadingPack(packId);
    try {
      console.log(`Initiating checkout for pack: ${packId}`);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId,
          userId,
        }),
      });

      const data = await response.json();
      console.log("Checkout response:", data);

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.url) {
        console.log("Redirecting to Stripe:", data.url);
        window.location.href = data.url; // Redirection Stripe
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(
        `Payment initialization failed: ${error.message}\n\nPlease check the console for details or contact support.`,
      );
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* --- PACK DÉCOUVERTE (2.99€) --- */}
      <PricingCard
        id="discovery"
        title={t("Packs.Discovery.name")}
        price={t("Packs.Discovery.price")}
        credits={t("Packs.Discovery.credits")}
        description={t("Packs.Discovery.description")}
        cta={t("Packs.Discovery.cta")}
        features={[
          t("Features.quality"),
          t("Features.commercial"),
          t("Features.formats"),
          t("Features.priority"),
          t("Features.support"),
        ]}
        icon={<Box className="w-6 h-6 text-zinc-400" />}
        isLoading={loadingPack === "discovery"}
        onSelect={() => handleCheckout("discovery")}
      />

      {/* --- PACK CRÉATEUR (9.99€) - POPULAR --- */}
      <PricingCard
        id="creator"
        title={t("Packs.Creator.name")}
        price={t("Packs.Creator.price")}
        credits={t("Packs.Creator.credits")}
        description={t("Packs.Creator.description")}
        cta={t("Packs.Creator.cta")}
        features={[
          t("Features.quality"),
          t("Features.commercial"),
          t("Features.formats"),
          t("Features.priority"),
          t("Features.support"),
        ]}
        icon={<Zap className="w-6 h-6 text-indigo-400" />}
        isPopular
        popularLabel={t("Badges.popular")}
        isLoading={loadingPack === "creator"}
        onSelect={() => handleCheckout("creator")}
      />

      {/* --- PACK STUDIO (29.99€) --- */}
      <PricingCard
        id="studio"
        title={t("Packs.Studio.name")}
        price={t("Packs.Studio.price")}
        credits={t("Packs.Studio.credits")}
        description={t("Packs.Studio.description")}
        cta={t("Packs.Studio.cta")}
        features={[
          t("Features.quality"),
          t("Features.commercial"),
          t("Features.formats"),
          t("Features.priority"),
          t("Features.support"),
        ]}
        icon={<Sparkles className="w-6 h-6 text-amber-400" />}
        isLoading={loadingPack === "studio"}
        onSelect={() => handleCheckout("studio")}
      />
    </div>
  );
}

// --- SUB-COMPONENT: CARD ---
function PricingCard({
  id,
  title,
  price,
  credits,
  description,
  cta,
  features,
  icon,
  isPopular = false,
  popularLabel,
  isLoading,
  onSelect,
}: any) {
  return (
    <div
      className={cn(
        "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group",
        isPopular
          ? "bg-zinc-900/80 border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] scale-105 z-10"
          : "bg-zinc-950/50 border-white/10 hover:border-white/20 hover:bg-zinc-900/50",
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full tracking-widest shadow-lg">
          {popularLabel}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 space-y-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center border",
            isPopular
              ? "bg-indigo-500/10 border-indigo-500/30"
              : "bg-zinc-900 border-white/5",
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-200 tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-bold text-white">{price}€</span>
            <span className="text-zinc-500 font-medium">/ pack</span>
          </div>
          <div className="text-sm font-mono text-indigo-400 mt-2 font-bold">
            {credits}
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed min-h-[40px]">
          {description}
        </p>
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-white/5 mb-6"></div>

      {/* Features */}
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
            <Check
              className={cn(
                "w-5 h-5 shrink-0",
                isPopular ? "text-indigo-400" : "text-zinc-500",
              )}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          "w-full h-12 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2",
          isPopular
            ? "bg-white text-black hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            : "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5",
          isLoading && "opacity-70 cursor-not-allowed",
        )}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {cta}
      </button>

      {/* Background Gradient for Popular */}
      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl pointer-events-none"></div>
      )}
    </div>
  );
}

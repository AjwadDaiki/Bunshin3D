"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Sparkle, Lightning, Cube } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { useOTO } from "@/components/providers/OTOProvider";
import { getPriceForCurrency, getOTOPriceForCurrency, isOTOEligible, PRICING_CONFIG, type PackId } from "@/lib/config/pricing";
import PricingCard from "./PricingCard";
import Toast from "@/components/ui/Toast";

function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export default function PricingTable() {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const { currency, isLoading: currencyLoading } = useCurrency();
  const { isOfferActive } = useOTO();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    };
    fetchUser();
  }, []);

  const handleCheckout = useCallback(async (packId: string) => {
    if (!userId) {
      setToast({ message: t("Checkout.loginRequired"), type: "info" });
      setTimeout(() => {
        window.location.href = `/${locale}/login?redirect=/pricing`;
      }, 1500);
      return;
    }

    setLoadingPack(packId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, userId, currency, isOTO: isOfferActive && isOTOEligible(packId as PackId), locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || t("Checkout.serverError", { status: response.status }),
        );
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(t("Checkout.noCheckoutUrl"));
      }
    } catch (error: any) {
      console.error(t("Checkout.checkoutErrorLog"), error);
      setToast({ message: t("Checkout.paymentInitFailed", { message: error.message }), type: "error" });
    } finally {
      setLoadingPack(null);
    }
  }, [userId, currency, isOfferActive, t]);

  const packs: {
    id: PackId;
    icon: React.ReactNode;
    isPopular?: boolean;
    isBestValue?: boolean;
  }[] = [
    {
      id: "discovery",
      icon: <Cube className="w-6 h-6 text-zinc-400" weight="duotone" />,
    },
    {
      id: "creator",
      icon: <Lightning className="w-6 h-6 text-indigo-400" weight="fill" />,
      isPopular: true,
    },
    {
      id: "studio",
      icon: <Sparkle className="w-6 h-6 text-amber-400" weight="fill" />,
      isBestValue: true,
    },
  ];

  const packNameMap: Record<PackId, string> = {
    discovery: "Discovery",
    creator: "Creator",
    studio: "Studio",
  };

  const discoveryPrice = getPriceForCurrency("discovery", currency);
  const discoveryPerCredit = discoveryPrice.amount / PRICING_CONFIG.discovery.credits;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packs.map(({ id, icon, isPopular, isBestValue }) => {
          const name = packNameMap[id];
          const priceData = getPriceForCurrency(id, currency);
          const otoPriceData = isOfferActive ? getOTOPriceForCurrency(id, currency) : null;

          const displayAmount = otoPriceData ? otoPriceData.amount : priceData.amount;
          const formattedPrice = currencyLoading
            ? "---"
            : formatPrice(displayAmount, priceData.currency, locale);

          const originalPrice = otoPriceData && !currencyLoading
            ? formatPrice(priceData.amount, priceData.currency, locale)
            : undefined;

          const perCredit = displayAmount / priceData.credits;
          const formattedPerCredit = currencyLoading
            ? "---"
            : formatPrice(perCredit, priceData.currency, locale);

          const savingsPercent =
            id === "studio"
              ? Math.round((1 - perCredit / discoveryPerCredit) * 100)
              : 0;

          return (
            <PricingCard
              key={id}
              id={id}
              title={t(`Packs.${name}.name`)}
              price={formattedPrice}
              originalPrice={originalPrice}
              pricePerCredit={formattedPerCredit}
              savingsPercent={savingsPercent}
              credits={t(`Packs.${name}.credits`)}
              description={t(`Packs.${name}.description`)}
              cta={t(`Packs.${name}.cta`)}
              features={[
                t("Features.quality"),
                t("Features.commercial"),
                t("Features.formats"),
                t("Features.priority"),
                t("Features.support"),
              ]}
              icon={icon}
              isPopular={isPopular}
              isBestValue={isBestValue}
              popularLabel={isPopular ? t("Badges.popular") : undefined}
              bestValueLabel={isBestValue ? t("Badges.bestValue") : undefined}
              isLoading={loadingPack === id}
              onSelect={() => handleCheckout(id)}
              isPromo={!!otoPriceData}
            />
          );
        })}
      </div>
    </>
  );
}

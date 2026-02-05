"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Cube, Crown, Star } from "@phosphor-icons/react";
import { showcaseItems, type ShowcaseItem } from "@/lib/showcase-data";

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const t = useTranslations("Showcase");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const itemLabel = t(`items.${item.id}`);
  const isPremium = item.type === "premium";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative aspect-square overflow-hidden rounded-xl border bg-[#111] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isPremium
          ? "border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10"
          : "border-white/6 hover:border-white/12 hover:shadow-black/20"
      }`}
    >
      {/* Type badge */}
      <div className="absolute top-3 left-3 z-30">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            isPremium
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/20"
              : "bg-white/10 text-neutral-400 border border-white/6"
          }`}
        >
          {isPremium ? (
            <Crown className="w-2.5 h-2.5" weight="fill" />
          ) : (
            <Star className="w-2.5 h-2.5" weight="fill" />
          )}
          {isPremium ? t("badges.premium") : t("badges.standard")}
        </span>
      </div>

      <div className="absolute inset-0">
        {isVisible ? (
          <model-viewer
            src={item.model_url}
            alt={itemLabel}
            loading="lazy"
            camera-controls
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="30deg"
            shadow-intensity="0.5"
            exposure="1"
            environment-image="neutral"
            disable-zoom
            class="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <div slot="progress-bar"></div>
          </model-viewer>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111]">
            <Cube
              className="h-8 w-8 text-neutral-700"
              weight="duotone"
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-linear-to-t from-black/70 via-black/40 to-transparent">
        <h3 className="text-sm font-medium text-white capitalize">
          {itemLabel}
        </h3>
        <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">
          {isPremium ? t("badges.premium") : t("badges.standard")}
        </p>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const t = useTranslations("Showcase");

  return (
    <section
      id="showcase"
      className="relative z-10 py-24 md:py-36"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">
            {t("title")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            {t("subtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {showcaseItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

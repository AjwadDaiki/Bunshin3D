"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Cube, CubeFocus, Crown, Star } from "@phosphor-icons/react";
import { showcaseItems, type ShowcaseItem } from "@/lib/showcase-data";

function ShowcaseBadge({ type }: { type: "standard" | "premium" }) {
  const t = useTranslations("Showcase");
  if (type === "premium") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 shadow-lg shadow-amber-500/10">
        <Crown className="h-3 w-3" weight="fill" />
        {t("badges.premium")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
      <Star className="h-3 w-3" weight="fill" />
      {t("badges.standard")}
    </span>
  );
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const t = useTranslations("Showcase");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const itemLabel = t(`items.${item.id}`);

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
      className="group relative aspect-square overflow-hidden rounded-2xl border border-white/6 bg-zinc-900/60 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-white/10 hover:shadow-2xl hover:shadow-purple-500/5"
    >
      {/* 3D Viewer */}
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
            shadow-intensity="1"
            shadow-softness="0.5"
            exposure="1"
            environment-image="neutral"
            disable-zoom
            class="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <div slot="progress-bar"></div>
          </model-viewer>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 animate-pulse">
            <Cube
              className="h-10 w-10 text-zinc-700"
              weight="duotone"
            />
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Badge */}
      <div className="absolute left-3 top-3 z-20">
        <ShowcaseBadge type={item.type} />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <h3 className="text-sm font-semibold text-white capitalize">
          {itemLabel}
        </h3>
      </div>

      {/* Hover icon */}
      <div className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 group-hover:bg-indigo-500 group-hover:border-indigo-500/50">
        <CubeFocus className="h-4 w-4 text-white" weight="duotone" />
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const t = useTranslations("Showcase");

  return (
    <section
      id="showcase"
      className="relative z-10 py-24"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-zinc-800" />
            {t("title")}
            <span className="h-px w-8 bg-zinc-800" />
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {showcaseItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

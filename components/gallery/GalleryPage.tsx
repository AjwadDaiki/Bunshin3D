"use client";

import { useTranslations } from "next-intl";
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from "@/lib/gallery-data";
import { useState } from "react";
import Image from "next/image";

export default function GalleryPage() {
  const t = useTranslations("Gallery");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-white text-neutral-950"
              : "bg-[#191919] border border-white/6 text-neutral-400 hover:text-white hover:border-white/12"
          }`}
        >
          {t("all")}
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-white text-neutral-950"
                : "bg-[#191919] border border-white/6 text-neutral-400 hover:text-white hover:border-white/12"
            }`}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-white/6 bg-[#111] overflow-hidden transition-all hover:border-white/12"
          >
            {/* Before/After container */}
            <div className="relative aspect-square bg-[#0a0a0a]">
              <Image
                src={item.inputImage}
                alt={t(`items.${item.id}`)}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/70 text-xs font-mono text-neutral-300">
                {t("inputLabel")}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-1">{t(`items.${item.id}`)}</h3>
              <p className="text-xs text-neutral-500">{t(`categories.${item.category}`)}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-neutral-500 py-20">{t("noResults")}</p>
      )}
    </div>
  );
}

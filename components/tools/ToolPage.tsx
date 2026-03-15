"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, UploadSimple } from "@phosphor-icons/react";
import type { ToolSlug } from "@/lib/tools-data";
import { TOOLS_DATA } from "@/lib/tools-data";

interface ToolPageProps {
  slug: ToolSlug;
}

export default function ToolPage({ slug }: ToolPageProps) {
  const t = useTranslations(`Tools.${slug}`);
  const tCommon = useTranslations("Tools.common");
  const toolData = TOOLS_DATA[slug];

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        {/* Hero */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-6">
          {t("h1")}
        </h1>
        <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mb-12">
          {t("description")}
        </p>

        {/* Upload zone - links to studio */}
        <Link
          href="/studio"
          className="group block rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/30 bg-[#111] hover:bg-[#141414] p-12 md:p-16 transition-all cursor-pointer"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <UploadSimple className="w-8 h-8 text-blue-400" weight="regular" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white mb-1">{tCommon("uploadTitle")}</p>
              <p className="text-sm text-neutral-500">{tCommon("uploadSubtitle")}</p>
            </div>
            <div className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 rounded-lg bg-white text-neutral-950 font-semibold text-sm group-hover:shadow-lg group-hover:shadow-white/10 transition-all">
              {tCommon("uploadCta")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" weight="bold" />
            </div>
          </div>
        </Link>

        {/* Output format badge */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="text-sm text-neutral-500">{tCommon("outputFormat")}</span>
          <span className="px-3 py-1 rounded-md bg-[#191919] border border-white/6 text-sm font-mono text-neutral-300">
            {toolData.outputFormat}
          </span>
        </div>

        {/* SEO content */}
        <div className="mt-16 text-left space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">{t("section1Title")}</h2>
            <p className="text-neutral-400 leading-relaxed">{t("section1Text")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">{t("section2Title")}</h2>
            <p className="text-neutral-400 leading-relaxed">{t("section2Text")}</p>
          </div>
        </div>

        {/* Related tools */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight mb-6">{tCommon("relatedTools")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {toolData.relatedSlugs.map((s) => (
              <Link
                key={s}
                href={`/tools/${s}`}
                className="group rounded-xl border border-white/6 bg-[#111] p-5 transition-all hover:border-white/12 hover:bg-[#161616] text-left"
              >
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                  {tCommon(`slugTitles.${s}`)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, FileArrowDown, Cube, UploadSimple, Printer } from "@phosphor-icons/react";
import { TOOL_SLUGS, TOOLS_DATA } from "@/lib/tools-data";

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "image-to-stl": <FileArrowDown className="w-5 h-5 text-blue-400" weight="duotone" />,
  "png-to-3d": <Cube className="w-5 h-5 text-emerald-400" weight="duotone" />,
  "logo-to-3d": <UploadSimple className="w-5 h-5 text-amber-400" weight="duotone" />,
  "photo-to-3d-print": <Printer className="w-5 h-5 text-purple-400" weight="duotone" />,
};

export default function HomeToolsSection() {
  const t = useTranslations("Tools.index");
  const tCommon = useTranslations("Tools.common");

  return (
    <section className="py-24 md:py-36 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">
            {t("label")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            {t("h1")}
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOL_SLUGS.map((slug) => {
            const data = TOOLS_DATA[slug];
            return (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/6 bg-[#111] p-5 transition-all hover:border-white/12 hover:bg-[#161616]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#191919] border border-white/6 flex items-center justify-center shrink-0">
                  {TOOL_ICONS[slug]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">
                    {tCommon(`slugTitles.${slug}`)}
                  </h3>
                  <span className="text-xs font-mono text-neutral-600">{data.outputFormat}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-blue-400 transition-colors shrink-0" weight="bold" />
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-3.5 h-3.5" weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}

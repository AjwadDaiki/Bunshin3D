import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { TOOL_SLUGS, TOOLS_DATA } from "@/lib/tools-data";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import { ArrowRight, UploadSimple, Cube, FileArrowDown, Printer } from "@phosphor-icons/react/dist/ssr";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "image-to-stl": <FileArrowDown className="w-6 h-6 text-blue-400" weight="duotone" />,
  "png-to-3d": <Cube className="w-6 h-6 text-emerald-400" weight="duotone" />,
  "logo-to-3d": <UploadSimple className="w-6 h-6 text-amber-400" weight="duotone" />,
  "photo-to-3d-print": <Printer className="w-6 h-6 text-purple-400" weight="duotone" />,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.index" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, "/tools"),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/tools`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Tools.index" });
  const tCommon = await getTranslations({ locale, namespace: "Tools.common" });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("h1"),
    numberOfItems: TOOL_SLUGS.length,
    itemListElement: TOOL_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tCommon(`slugTitles.${slug}`),
      url: `${APP_URL}/${locale}/tools/${slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <main className="min-h-screen text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <header className="text-center mb-16">
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">{t("label")}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">{t("h1")}</h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">{t("description")}</p>
          </header>

          <div className="grid sm:grid-cols-2 gap-6">
            {TOOL_SLUGS.map((slug) => {
              const data = TOOLS_DATA[slug];
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group rounded-xl border border-white/6 bg-[#111] p-8 transition-all hover:border-white/12 hover:bg-[#161616] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#191919] border border-white/6 flex items-center justify-center shrink-0">
                      {TOOL_ICONS[slug]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {tCommon(`slugTitles.${slug}`)}
                      </h2>
                      <p className="text-sm text-neutral-500 mb-3">{t(`descriptions.${slug}`)}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-600 bg-white/3 px-2 py-0.5 rounded">{data.outputFormat}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-blue-400 transition-colors ml-auto" weight="bold" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/studio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
            >
              {tCommon("uploadCta")}
              <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

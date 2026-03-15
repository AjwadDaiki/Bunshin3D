import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FORMAT_SLUGS, FORMATS_DATA } from "@/lib/formats-data";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Formats.index" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, "/formats"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FormatsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Formats.index" });
  const tCommon = await getTranslations({ locale, namespace: "Formats.common" });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("h1"),
    numberOfItems: FORMAT_SLUGS.length,
    itemListElement: FORMAT_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tCommon(`slugTitles.${slug}`),
      url: `${APP_URL}/${locale}/formats/${slug}`,
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FORMAT_SLUGS.map((slug) => (
              <Link key={slug} href={`/formats/${slug}`} className="group rounded-xl border border-white/6 bg-[#111] p-6 transition-all hover:border-white/12 hover:bg-[#161616]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-mono text-blue-400">{FORMATS_DATA[slug].extension}</span>
                </div>
                <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">{tCommon(`slugTitles.${slug}`)}</h2>
                <p className="text-sm text-neutral-500 line-clamp-2">{tCommon(`slugDescriptions.${slug}`)}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/studio" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100">{tCommon("ctaTryFree")}</Link>
          </div>
        </div>
      </main>
    </>
  );
}

import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { USE_CASE_SLUGS, USE_CASES_DATA } from "@/lib/use-cases-data";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UseCases.index" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, "/use-cases"),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/use-cases`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@bunshin3d",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function UseCasesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "UseCases.index" });
  const tCommon = await getTranslations({ locale, namespace: "UseCases.common" });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bunshin 3D", item: `${APP_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("metaTitle"), item: `${APP_URL}/${locale}/use-cases` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    numberOfItems: USE_CASE_SLUGS.length,
    itemListElement: USE_CASE_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tCommon(`slugTitles.${slug}`),
      url: `${APP_URL}/${locale}/use-cases/${slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <main className="min-h-screen text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <header className="text-center mb-16">
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">
              {t("label")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
              {t("h1")}
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </header>

          {/* Use case grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASE_SLUGS.map((slug) => {
              const data = USE_CASES_DATA[slug];
              return (
                <Link
                  key={slug}
                  href={`/use-cases/${slug}`}
                  className="group rounded-xl border border-white/6 bg-[#111] p-6 transition-all hover:border-white/12 hover:bg-[#161616]"
                >
                  <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-3 text-base">
                    {tCommon(`slugTitles.${slug}`)}
                  </h2>
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                    {tCommon(`slugDescriptions.${slug}`)}
                  </p>
                  <div className="flex gap-2">
                    {data.formats.slice(0, 3).map((f) => (
                      <span key={f} className="text-xs text-neutral-600 font-mono bg-white/3 px-2 py-0.5 rounded">
                        .{f.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link
              href="/studio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
            >
              {tCommon("ctaTryFree")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { COMPARE_SLUGS, COMPARE_DATA } from "@/lib/compare-data";
import type { CompareSlug } from "@/lib/compare-data";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import StickyCTA from "@/components/shared/StickyCTA";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of COMPARE_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!COMPARE_SLUGS.includes(slug as CompareSlug)) return {};
  const t = await getTranslations({ locale, namespace: `Compare.${slug}` });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, `/compare/${slug}`),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/compare/${slug}`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  if (!COMPARE_SLUGS.includes(slug as CompareSlug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: `Compare.${slug}` });
  const tCommon = await getTranslations({ locale, namespace: "Compare.common" });
  const compareData = COMPARE_DATA[slug as CompareSlug];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bunshin 3D", item: `${APP_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: tCommon("indexTitle"), item: `${APP_URL}/${locale}/compare` },
      { "@type": "ListItem", position: 3, name: t("breadcrumb"), item: `${APP_URL}/${locale}/compare/${slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5].map((i) => ({
      "@type": "Question",
      name: t(`faq${i}Q`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq${i}A`) },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <main className="min-h-screen text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Bunshin 3D</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-white transition-colors">{tCommon("indexTitle")}</Link>
            <span>/</span>
            <span className="text-neutral-300">{t("breadcrumb")}</span>
          </nav>

          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-6">{t("h1")}</h1>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl">{t("heroDescription")}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/studio" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100">{tCommon("ctaTryFree")}</Link>
              <Link href="/pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-8 font-medium text-white transition-all hover:bg-white/6">{tCommon("ctaPricing")}</Link>
            </div>
          </header>

          {}
          <section className="mb-16 overflow-x-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{t("comparisonTitle")}</h2>
            <div className="rounded-xl border border-white/6 bg-[#111] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left px-6 py-4 text-neutral-400 font-medium">{tCommon("feature")}</th>
                    <th className="text-center px-6 py-4 text-blue-400 font-semibold">Bunshin 3D</th>
                    <th className="text-center px-6 py-4 text-neutral-400 font-medium">{compareData.competitorName || tCommon("others")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <tr key={i} className="border-b border-white/4 last:border-0">
                      <td className="px-6 py-4 text-neutral-300">{t(`row${i}Feature`)}</td>
                      <td className="px-6 py-4 text-center text-emerald-400">{t(`row${i}Bunshin`)}</td>
                      <td className="px-6 py-4 text-center text-neutral-500">{t(`row${i}Competitor`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <article className="space-y-12 mb-16">
            <section>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("section1Title")}</h2>
              <p className="text-neutral-400 leading-relaxed">{t("section1Text")}</p>
            </section>
            <section>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("section2Title")}</h2>
              <p className="text-neutral-400 leading-relaxed">{t("section2Text")}</p>
            </section>
          </article>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("faqTitle")}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <details key={i} className="group rounded-xl border border-white/6 bg-[#111] overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-medium text-zinc-200 hover:text-white transition-colors">
                    <span>{t(`faq${i}Q`)}</span>
                    <svg className="w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">{t(`faq${i}A`)}</div>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/6 bg-[#111] p-8 md:p-12 text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("ctaTitle")}</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">{t("ctaDescription")}</p>
            <Link href="/studio" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100">{tCommon("ctaTryFree")}</Link>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("relatedComparisons")}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {compareData.relatedSlugs.map((s) => (
                <Link key={s} href={`/compare/${s}`} className="group rounded-xl border border-white/6 bg-[#111] p-6 transition-all hover:border-white/12 hover:bg-[#161616]">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{tCommon(`slugTitles.${s}`)}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <StickyCTA />
    </>
  );
}

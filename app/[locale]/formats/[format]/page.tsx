import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { FORMAT_SLUGS, FORMATS_DATA } from "@/lib/formats-data";
import type { FormatSlug } from "@/lib/formats-data";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import StickyCTA from "@/components/shared/StickyCTA";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export function generateStaticParams() {
  const params: { locale: string; format: string }[] = [];
  for (const locale of routing.locales) {
    for (const format of FORMAT_SLUGS) {
      params.push({ locale, format });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; format: string }>;
}): Promise<Metadata> {
  const { locale, format } = await params;
  if (!FORMAT_SLUGS.includes(format as FormatSlug)) return {};
  const t = await getTranslations({ locale, namespace: `Formats.${format}` });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, `/formats/${format}`),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/formats/${format}`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function FormatPage({
  params,
}: {
  params: Promise<{ locale: string; format: string }>;
}) {
  const { locale, format } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  if (!FORMAT_SLUGS.includes(format as FormatSlug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: `Formats.${format}` });
  const tCommon = await getTranslations({ locale, namespace: "Formats.common" });
  const formatData = FORMATS_DATA[format as FormatSlug];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("h1"),
    description: t("metaDescription"),
    step: [
      { "@type": "HowToStep", position: 1, name: t("step1Title"), text: t("step1Desc") },
      { "@type": "HowToStep", position: 2, name: t("step2Title"), text: t("step2Desc") },
      { "@type": "HowToStep", position: 3, name: t("step3Title"), text: t("step3Desc") },
    ],
    tool: [{ "@type": "HowToTool", name: "Bunshin 3D" }],
    totalTime: "PT1M",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bunshin 3D", item: `${APP_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: tCommon("indexTitle"), item: `${APP_URL}/${locale}/formats` },
      { "@type": "ListItem", position: 3, name: t("breadcrumb"), item: `${APP_URL}/${locale}/formats/${format}` },
    ],
  };

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: t("h1"),
    description: t("metaDescription"),
    url: `${APP_URL}/${locale}/formats/${format}`,
    inLanguage: locale,
    image: `${APP_URL}/og-image.jpg`,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Bunshin 3D",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Bunshin 3D",
      logo: { "@type": "ImageObject", url: `${APP_URL}/icon-512.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_URL}/${locale}/formats/${format}`,
    },
    proficiencyLevel: "Beginner",
    keywords: t("keywords"),
  };

  return (
    <>
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={techArticleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Bunshin 3D</Link>
            <span>/</span>
            <Link href="/formats" className="hover:text-white transition-colors">{tCommon("indexTitle")}</Link>
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("howItWorks")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="rounded-xl border border-white/6 bg-[#111] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold">{step}</span>
                    <h3 className="font-semibold text-white">{t(`step${step}Title`)}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{t(`step${step}Desc`)}</p>
                </div>
              ))}
            </div>
          </section>

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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("relatedFormats")}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {formatData.relatedSlugs.map((s) => (
                <Link key={s} href={`/formats/${s}`} className="group rounded-xl border border-white/6 bg-[#111] p-6 transition-all hover:border-white/12 hover:bg-[#161616]">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">{tCommon(`slugTitles.${s}`)}</h3>
                  <span className="text-xs text-neutral-500 font-mono">{FORMATS_DATA[s].extension}</span>
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

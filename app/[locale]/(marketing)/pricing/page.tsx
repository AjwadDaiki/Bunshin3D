import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";
import { getPricingSchemas } from "@/lib/schemas/pricing";
import ReferralPromoPanel from "@/components/referral/ReferralPromoPanel";
import { generateAlternates, generateOGMetadata, APP_URL } from "@/lib/seo-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing.Metadata" });

  return {
    ...baseMetadataConfig,
    title: t("title"),
    description: t("description"),
    alternates: generateAlternates(locale, "/pricing"),
    openGraph: generateOGMetadata(locale, "/pricing", t("title"), t("description")),
    keywords: t("keywords").split(", "),
    twitter: {
      card: "summary_large_image" as const,
      site: "@bunshin3d",
      creator: "@bunshin3d",
      title: t("title"),
      description: t("description"),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const tHeader = await getTranslations("Pricing.Header");
  const tFooter = await getTranslations("Pricing.Footer");
  const tTrust = await getTranslations("Pricing.Trust");
  const tFaq = await getTranslations("Pricing.FAQ");
  const tSocial = await getTranslations("Pricing.SocialProof");
  const { productSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } =
    await getPricingSchemas(locale, APP_URL);

  const faqItems = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
    { q: tFaq("q4"), a: tFaq("a4") },
    { q: tFaq("q5"), a: tFaq("a5") },
  ];

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />
      <JsonLd data={webPageSchema} />

      <div className="min-h-screen text-white pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 container mx-auto text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            {tHeader("title")} <br className="hidden md:block" />
            <span className="text-blue-500">
              {tHeader("titleHighlight")}
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {tHeader("subtitle")}
          </p>
        </div>

        {/* Trust bar */}
        <div className="relative z-10 max-w-3xl mx-auto mb-16">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              {tTrust("secure")}
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              {tTrust("noSub")}
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {tTrust("neverExpire")}
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              {tTrust("commercial")}
            </span>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-4">
            {tSocial("users")}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="relative z-10">
          <PricingTable />
        </div>

        {/* Referral */}
        <div className="relative z-10 mt-16 max-w-5xl mx-auto px-4">
          <ReferralPromoPanel />
        </div>

        {/* FAQ */}
        <div className="relative z-10 mt-20 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 tracking-tight">
            {tFaq("title")}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/6 bg-[#111] overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-medium text-zinc-200 hover:text-white transition-colors">
                  <span>{item.q}</span>
                  <svg
                    className="w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-20 text-zinc-500 text-sm font-mono uppercase tracking-widest opacity-60">
          {tFooter("note")}
        </div>
      </div>
    </>
  );
}

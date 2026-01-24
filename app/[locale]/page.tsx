import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import LandingPage from "@/components/home/LandingPage";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";

// --- SEO CONFIGURATION ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    ...baseMetadataConfig,
    title: {
      default: t("defaultTitle"),
      template: t("templateTitle"),
    },
    description: t("description"),
    applicationName: t("applicationName"),
    keywords: t("keywords").split(", "),
    openGraph: {
      ...baseMetadataConfig.openGraph,
      title: t("ogTitle"),
      description: t("ogDescription"),
      locale: locale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// --- MAIN PAGE ---
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // Récupération des traductions pour le Header Pricing
  const tPricing = await getTranslations({
    locale,
    namespace: "Pricing.Header",
  });

  // Schema.org pour l'Organisation et l'Application
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bunshin 3D",
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* 1. Landing Page Content (Hero, Showcase, Features) */}
      <LandingPage />

      {/* 2. Pricing Section Injected Here */}
      <section
        id="pricing"
        className="py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5 -mb-32"
      >
        {/* Background Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Pricing Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              {tPricing("title")}{" "}
              <span className="bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                {tPricing("titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {tPricing("subtitle")}
            </p>
          </div>

          {/* Pricing Table Component */}
          <PricingTable />
        </div>
      </section>
    </>
  );
}

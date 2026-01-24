import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";

// --- CONFIGURATION SEO ---
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/pricing`,
    },
    openGraph: {
      ...baseMetadataConfig.openGraph,
      title: t("title"),
      description: t("description"),
      locale: locale,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// --- PAGE PRINCIPALE ---
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

  // JSON-LD: Schema Product avec Offres mises à jour
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Bunshin 3D Credits",
    description: "AI 3D Model Generation Credits",
    image: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "2.99",
      highPrice: "29.99",
      offerCount: "3",
      offers: [
        {
          "@type": "Offer",
          name: "Discovery Pack",
          price: "2.99",
          priceCurrency: "EUR",
          description: "10 Credits",
        },
        {
          "@type": "Offer",
          name: "Creator Pack",
          price: "9.99",
          priceCurrency: "EUR",
          description: "50 Credits",
        },
        {
          "@type": "Offer",
          name: "Studio Pack",
          price: "29.99",
          priceCurrency: "EUR",
          description: "200 Credits",
        },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4 overflow-hidden relative">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 container mx-auto text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            {tHeader("title")} <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent">
              {tHeader("titleHighlight")}
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {tHeader("subtitle")}
          </p>
        </div>

        {/* Pricing UI */}
        <div className="relative z-10">
          <PricingTable />
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-20 text-zinc-500 text-sm font-mono uppercase tracking-widest opacity-60">
          Secure Payment via Stripe • Instant Delivery
        </div>
      </div>
    </>
  );
}

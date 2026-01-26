import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import PricingTable from "@/components/marketing/PricingTable";
import { baseMetadataConfig } from "@/lib/seo-config";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing.Metadata" });

  const alternateLanguages: Record<string, string> = {};
  routing.locales.forEach((loc) => {
    alternateLanguages[loc] = `${APP_URL}/${loc}/pricing`;
  });
  alternateLanguages["x-default"] = `${APP_URL}/fr/pricing`;

  return {
    ...baseMetadataConfig,
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${APP_URL}/${locale}/pricing`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${APP_URL}/${locale}/pricing`,
      siteName: "Bunshin 3D",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${APP_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: locale === "fr" ? "Tarifs Bunshin 3D" : "Bunshin 3D Pricing",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@bunshin3d",
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${APP_URL}/#product`,
    name: locale === "fr" ? "Crédits Bunshin 3D" : "Bunshin 3D Credits",
    description: locale === "fr"
      ? "Crédits pour la génération de modèles 3D par IA"
      : "Credits for AI 3D Model Generation",
    brand: {
      "@type": "Brand",
      name: "Bunshin 3D",
    },
    image: `${APP_URL}/og-image.jpg`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "2.99",
      highPrice: "29.99",
      offerCount: "3",
      availability: "https://schema.org/InStock",
      offers: [
        {
          "@type": "Offer",
          name: locale === "fr" ? "Pack Découverte" : "Discovery Pack",
          price: "2.99",
          priceCurrency: "EUR",
          description: locale === "fr" ? "10 Crédits - Parfait pour tester" : "10 Credits - Perfect for testing",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${APP_URL}/${locale}/pricing`,
        },
        {
          "@type": "Offer",
          name: locale === "fr" ? "Pack Créateur" : "Creator Pack",
          price: "9.99",
          priceCurrency: "EUR",
          description: locale === "fr" ? "50 Crédits - Pour designers et créateurs" : "50 Credits - For designers & creators",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${APP_URL}/${locale}/pricing`,
        },
        {
          "@type": "Offer",
          name: locale === "fr" ? "Pack Studio" : "Studio Pack",
          price: "29.99",
          priceCurrency: "EUR",
          description: locale === "fr" ? "200 Crédits - Usage intensif et professionnels" : "200 Credits - Intensive usage & pros",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${APP_URL}/${locale}/pricing`,
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "856",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "fr" ? "Accueil" : "Home",
        item: `${APP_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "fr" ? "Tarifs" : "Pricing",
        item: `${APP_URL}/${locale}/pricing`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4 overflow-hidden relative">
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

        <div className="relative z-10">
          <PricingTable />
        </div>

        <div className="text-center mt-20 text-zinc-500 text-sm font-mono uppercase tracking-widest opacity-60">
          {locale === "fr" ? "Paiement sécurisé via Stripe • Livraison instantanée" : "Secure Payment via Stripe • Instant Delivery"}
        </div>
      </div>
    </>
  );
}

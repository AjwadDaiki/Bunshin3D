import { getTranslations } from "next-intl/server";
import { PRICING_CONFIG } from "@/lib/config/pricing";
import { localeToLang } from "@/lib/seo-utils";

type SchemaResult = {
  productSchema: Record<string, any>;
  breadcrumbSchema: Record<string, any>;
  faqSchema: Record<string, any>;
  itemListSchema: Record<string, any>;
  webPageSchema: Record<string, any>;
};

export async function getPricingSchemas(
  locale: string,
  appUrl: string,
): Promise<SchemaResult> {
  const t = await getTranslations({ locale, namespace: "Pricing.Schema" });
  const tFaq = await getTranslations({ locale, namespace: "Pricing.FAQ" });

  const eurPrices = {
    discovery: PRICING_CONFIG.discovery.prices.EUR.amount,
    creator: PRICING_CONFIG.creator.prices.EUR.amount,
    studio: PRICING_CONFIG.studio.prices.EUR.amount,
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${appUrl}/#product`,
    name: t("productName"),
    description: t("productDescription"),
    brand: {
      "@type": "Brand",
      name: t("brandName"),
    },
    image: `${appUrl}/og-image.jpg`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: String(eurPrices.discovery),
      highPrice: String(eurPrices.studio),
      offerCount: "3",
      availability: "https://schema.org/InStock",
      offers: [
        {
          "@type": "Offer",
          name: t("offers.discovery.name"),
          price: String(eurPrices.discovery),
          priceCurrency: "EUR",
          description: t("offers.discovery.description"),
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${appUrl}/${locale}/pricing`,
        },
        {
          "@type": "Offer",
          name: t("offers.creator.name"),
          price: String(eurPrices.creator),
          priceCurrency: "EUR",
          description: t("offers.creator.description"),
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${appUrl}/${locale}/pricing`,
        },
        {
          "@type": "Offer",
          name: t("offers.studio.name"),
          price: String(eurPrices.studio),
          priceCurrency: "EUR",
          description: t("offers.studio.description"),
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          url: `${appUrl}/${locale}/pricing`,
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
        name: t("breadcrumb.home"),
        item: `${appUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.pricing"),
        item: `${appUrl}/${locale}/pricing`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: tFaq("q1"), acceptedAnswer: { "@type": "Answer", text: tFaq("a1") } },
      { "@type": "Question", name: tFaq("q2"), acceptedAnswer: { "@type": "Answer", text: tFaq("a2") } },
      { "@type": "Question", name: tFaq("q3"), acceptedAnswer: { "@type": "Answer", text: tFaq("a3") } },
      { "@type": "Question", name: tFaq("q4"), acceptedAnswer: { "@type": "Answer", text: tFaq("a4") } },
      { "@type": "Question", name: tFaq("q5"), acceptedAnswer: { "@type": "Answer", text: tFaq("a5") } },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("productName"),
    numberOfItems: 3,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("offers.discovery.name"),
        url: `${appUrl}/${locale}/pricing`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("offers.creator.name"),
        url: `${appUrl}/${locale}/pricing`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("offers.studio.name"),
        url: `${appUrl}/${locale}/pricing`,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${appUrl}/${locale}/pricing#webpage`,
    url: `${appUrl}/${locale}/pricing`,
    name: t("productName"),
    description: t("productDescription"),
    inLanguage: localeToLang[locale] || "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      name: "Bunshin 3D",
      url: appUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
      name: "Bunshin 3D",
    },
    potentialAction: {
      "@type": "ReadAction",
      target: `${appUrl}/${locale}/pricing`,
    },
  };

  return { productSchema, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema };
}

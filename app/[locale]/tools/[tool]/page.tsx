import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { TOOL_SLUGS } from "@/lib/tools-data";
import type { ToolSlug } from "@/lib/tools-data";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import ToolPage from "@/components/tools/ToolPage";
import StickyCTA from "@/components/shared/StickyCTA";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export function generateStaticParams() {
  const params: { locale: string; tool: string }[] = [];
  for (const locale of routing.locales) {
    for (const tool of TOOL_SLUGS) {
      params.push({ locale, tool });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!TOOL_SLUGS.includes(tool as ToolSlug)) return {};
  const t = await getTranslations({ locale, namespace: `Tools.${tool}` });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, `/tools/${tool}`),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/tools/${tool}`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function ToolPageRoute({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { locale, tool } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  if (!TOOL_SLUGS.includes(tool as ToolSlug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: `Tools.${tool}` });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bunshin 3D", item: `${APP_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("h1"), item: `${APP_URL}/${locale}/tools/${tool}` },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("h1"),
    description: t("metaDescription"),
    applicationCategory: "DesignApplication",
    applicationSubCategory: "3D Modeling",
    operatingSystem: "Web",
    url: `${APP_URL}/${locale}/tools/${tool}`,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
      bestRating: "5",
      worstRating: "1",
    },
    keywords: t("keywords"),
    publisher: {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Bunshin 3D",
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareAppSchema} />
      <ToolPage slug={tool as ToolSlug} />
      <StickyCTA />
    </>
  );
}

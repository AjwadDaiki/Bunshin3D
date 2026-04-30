import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { USE_CASE_SLUGS, USE_CASES_DATA } from "@/lib/use-cases-data";
import type { UseCaseSlug } from "@/lib/use-cases-data";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import UseCasePage from "@/components/use-cases/UseCasePage";
import StickyCTA from "@/components/shared/StickyCTA";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of USE_CASE_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: `UseCases.${slug}` });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, `/use-cases/${slug}`),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/use-cases/${slug}`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [
        {
          url: `${APP_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("h1"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@bunshin3d",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function UseCasePageRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: `UseCases.${slug}` });
  const tCommon = await getTranslations({ locale, namespace: "UseCases.common" });
  const useCaseData = USE_CASES_DATA[slug as UseCaseSlug];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("h1"),
    description: t("metaDescription"),
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: t("step1Title"),
        text: t("step1Desc"),
        url: `${APP_URL}/${locale}/use-cases/${slug}#step-1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: t("step2Title"),
        text: t("step2Desc"),
        url: `${APP_URL}/${locale}/use-cases/${slug}#step-2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: t("step3Title"),
        text: t("step3Desc"),
        url: `${APP_URL}/${locale}/use-cases/${slug}#step-3`,
      },
    ],
    tool: [{ "@type": "HowToTool", name: "Bunshin 3D" }],
    supply: [{ "@type": "HowToSupply", name: t("supplyName") }],
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: t("faq1Q"), acceptedAnswer: { "@type": "Answer", text: t("faq1A") } },
      { "@type": "Question", name: t("faq2Q"), acceptedAnswer: { "@type": "Answer", text: t("faq2A") } },
      { "@type": "Question", name: t("faq3Q"), acceptedAnswer: { "@type": "Answer", text: t("faq3A") } },
      { "@type": "Question", name: t("faq4Q"), acceptedAnswer: { "@type": "Answer", text: t("faq4A") } },
      { "@type": "Question", name: t("faq5Q"), acceptedAnswer: { "@type": "Answer", text: t("faq5A") } },
    ],
  };

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: t("h1"),
    description: t("metaDescription"),
    url: `${APP_URL}/${locale}/use-cases/${slug}`,
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
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/icon-512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_URL}/${locale}/use-cases/${slug}`,
    },
    proficiencyLevel: "Beginner",
    keywords: t("keywords"),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Bunshin 3D",
        item: `${APP_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tCommon("indexTitle"),
        item: `${APP_URL}/${locale}/use-cases`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("h1"),
        item: `${APP_URL}/${locale}/use-cases/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={howToSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={techArticleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <UseCasePage
        slug={slug as UseCaseSlug}
        useCaseData={useCaseData}
        locale={locale}
      />
      <StickyCTA />
    </>
  );
}

import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import StudioInterface from "@/components/studio/StudioInterface";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateAlternates } from "@/lib/seo-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Studio.Metadata" });
  const tGlobal = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: true,
    },
    alternates: generateAlternates(locale, "/studio"),
    applicationName: tGlobal("applicationName"),
    keywords: t("keywords").split(", "),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const tJsonLd = await getTranslations("Studio.JsonLd");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tJsonLd("name"),
    applicationCategory: tJsonLd("applicationCategory"),
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    featureList: tJsonLd("featureList"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main className="min-h-screen text-white pt-10">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl pt-24">
          <StudioInterface />
        </div>
      </main>
    </>
  );
}

import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { generateAlternates } from "@/lib/seo-utils";
import GalleryPage from "@/components/gallery/GalleryPage";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Gallery" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("keywords").split(", "),
    alternates: generateAlternates(locale, "/gallery"),
    openGraph: {
      type: "website",
      url: `${APP_URL}/${locale}/gallery`,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Bunshin 3D",
      images: [{ url: `${APP_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function GalleryRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Gallery" });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bunshin 3D", item: `${APP_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("metaTitle"), item: `${APP_URL}/${locale}/gallery` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <main className="min-h-screen text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center mb-16">
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4">{t("label")}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">{t("h1")}</h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">{t("description")}</p>
          </header>

          <GalleryPage />

          {/* SEO content */}
          <article className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("seoTitle")}</h2>
            <p className="text-neutral-400 leading-relaxed mb-8">{t("seoText")}</p>
          </article>

          <div className="text-center mt-16">
            <Link href="/studio" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100">{t("cta")}</Link>
          </div>
        </div>
      </main>
    </>
  );
}

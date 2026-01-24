import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return {
    title: "Terms of Service | Bunshin3D",
    description:
      "Terms and conditions for using Bunshin3D AI 3D generation service",
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/terms`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en/terms`,
        fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr/terms`,
        es: `${process.env.NEXT_PUBLIC_APP_URL}/es/terms`,
        de: `${process.env.NEXT_PUBLIC_APP_URL}/de/terms`,
        ja: `${process.env.NEXT_PUBLIC_APP_URL}/ja/terms`,
        zh: `${process.env.NEXT_PUBLIC_APP_URL}/zh/terms`,
      },
    },
  };
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("Legal.Terms");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-zinc-500 text-sm mb-12">{t("lastUpdated")}</p>

        <div className="space-y-12">
          <section>
            <p className="text-lg leading-relaxed">{t("intro")}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {t("section1Title")}
            </h2>
            <p className="leading-relaxed">{t("section1Text")}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {t("section2Title")}
            </h2>
            <p className="leading-relaxed">{t("section2Text")}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {t("section3Title")}
            </h2>
            <p className="leading-relaxed">{t("section3Text")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

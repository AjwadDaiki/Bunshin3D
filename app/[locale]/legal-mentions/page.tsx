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
    title: "Legal Mentions | Bunshin3D",
    description: "Legal information and mentions for Bunshin3D",
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/legal-mentions`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en/legal-mentions`,
        fr: `${process.env.NEXT_PUBLIC_APP_URL}/fr/legal-mentions`,
        es: `${process.env.NEXT_PUBLIC_APP_URL}/es/legal-mentions`,
        de: `${process.env.NEXT_PUBLIC_APP_URL}/de/legal-mentions`,
        ja: `${process.env.NEXT_PUBLIC_APP_URL}/ja/legal-mentions`,
        zh: `${process.env.NEXT_PUBLIC_APP_URL}/zh/legal-mentions`,
      },
    },
  };
}

export default function MentionsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("Legal.Mentions");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-12">{t("title")}</h1>

        <div className="space-y-12 border-l border-white/10 pl-8">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">{t("editorTitle")}</h2>
            <p className="whitespace-pre-line leading-relaxed">
              {t("editorText")}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">{t("hostTitle")}</h2>
            <p className="whitespace-pre-line leading-relaxed">
              {t("hostText")}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {t("creditsTitle")}
            </h2>
            <p className="whitespace-pre-line leading-relaxed">
              {t("creditsText")}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

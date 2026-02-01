import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AuthForm from "@/components/auth/AuthForm";
import { generateAlternates } from "@/lib/seo-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("title"),
    description: t("subtitle"),
    robots: {
      index: false,
      follow: true,
    },
    alternates: generateAlternates(locale, "/login"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Suspense
          fallback={
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
              <p className="text-center text-sm text-zinc-400">{t("loading")}</p>
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}

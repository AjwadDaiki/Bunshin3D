import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import StudioInterface from "@/components/studio/StudioInterface";
import { routing } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import { createServerClient } from "@supabase/ssr"; // Ajout pour la protection
import { cookies } from "next/headers";

// --- CONFIGURATION SEO STRICTE (Traduction Dynamique) ---
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
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/studio`,
    },
    // On garde le template global défini dans le layout mais on surcharge le titre spécifique
    applicationName: tGlobal("applicationName"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// --- PAGE PRINCIPALE ---
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

  // 1. PROTECTION SERVEUR (Nouveau bloc)
  // On vérifie le cookie de session AVANT de rendre quoi que ce soit
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
    redirect(`/${locale}/login`); // Ejection immédiate si pas connecté
  }

  // 2. Récupération des traductions serveur
  const tHeader = await getTranslations("Studio.Header");
  const tJsonLd = await getTranslations("Studio.JsonLd");

  // Schema.org traduit dynamiquement
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
    },
    featureList: tJsonLd("featureList"),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <main className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 pt-10">
        {/* Background FX (Original) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl pt-24">
          {" "}
          {/* Ajout padding top pour header fixe */}
          {/* Header Page (Original) */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                {tHeader("title")}
                <span className="text-indigo-500">.</span>
              </h1>
              <p className="text-zinc-400 max-w-lg text-lg leading-relaxed">
                {tHeader("subtitle")} <br />
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                  {tHeader("version")}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {tHeader("status")}
              </div>
              <div className="h-4 w-px bg-zinc-800"></div>
              <div>{tHeader("latency")}</div>
            </div>
          </header>
          <StudioInterface />
        </div>
      </main>
    </>
  );
}

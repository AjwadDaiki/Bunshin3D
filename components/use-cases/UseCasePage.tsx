import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { UseCaseSlug, UseCaseData } from "@/lib/use-cases-data";
import { USE_CASES_DATA } from "@/lib/use-cases-data";

interface UseCasePageProps {
  slug: UseCaseSlug;
  useCaseData: UseCaseData;
  locale: string;
}

export default async function UseCasePage({ slug, useCaseData, locale }: UseCasePageProps) {
  const t = await getTranslations({ locale, namespace: `UseCases.${slug}` });
  const tCommon = await getTranslations({ locale, namespace: "UseCases.common" });

  const relatedCases = useCaseData.relatedSlugs.map((s) => USE_CASES_DATA[s]);

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Bunshin 3D
          </Link>
          <span>/</span>
          <Link href="/use-cases" className="hover:text-white transition-colors">
            {tCommon("indexTitle")}
          </Link>
          <span>/</span>
          <span className="text-neutral-300">{t("breadcrumb")}</span>
        </nav>

        {/* Hero */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-6">
            {t("h1")}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl">
            {t("heroDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/studio"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
            >
              {tCommon("ctaTryFree")}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-8 font-medium text-white transition-all hover:bg-white/6"
            >
              {tCommon("ctaPricing")}
            </Link>
          </div>
        </header>

        {/* Main content - SEO rich text */}
        <article className="prose prose-invert prose-neutral max-w-none mb-16">
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("section1Title")}</h2>
            <p className="text-neutral-400 leading-relaxed text-base">{t("section1Text")}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("section2Title")}</h2>
            <p className="text-neutral-400 leading-relaxed text-base">{t("section2Text")}</p>
          </section>
        </article>

        {/* How it works steps */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                id={`step-${step}`}
                className="rounded-xl border border-white/6 bg-[#111] p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold">
                    {step}
                  </span>
                  <h3 className="font-semibold text-white">
                    {t(`step${step}Title`)}
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {t(`step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported formats */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{tCommon("supportedFormats")}</h2>
          <div className="flex flex-wrap gap-3">
            {useCaseData.formats.map((format) => (
              <span
                key={format}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#191919] border border-white/6 text-sm font-mono text-neutral-300"
              >
                .{format.toLowerCase()}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("faqTitle")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/6 bg-[#111] overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-medium text-zinc-200 hover:text-white transition-colors">
                  <span>{t(`faq${i}Q`)}</span>
                  <svg
                    className="w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {t(`faq${i}A`)}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-white/6 bg-[#111] p-8 md:p-12 text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("ctaTitle")}</h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">{t("ctaDescription")}</p>
          <Link
            href="/studio"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/10"
          >
            {tCommon("ctaTryFree")}
          </Link>
        </section>

        {/* Related use cases */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{tCommon("relatedUseCases")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedCases.map((related) => (
              <Link
                key={related.slug}
                href={`/use-cases/${related.slug}`}
                className="group rounded-xl border border-white/6 bg-[#111] p-6 transition-all hover:border-white/12 hover:bg-[#161616]"
              >
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {tCommon(`slugTitles.${related.slug}`)}
                </h3>
                <div className="flex gap-2">
                  {related.formats.slice(0, 3).map((f) => (
                    <span key={f} className="text-xs text-neutral-500 font-mono">.{f.toLowerCase()}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

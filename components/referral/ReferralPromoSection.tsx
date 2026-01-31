"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Sparkle, ShareNetwork, UserPlus } from "@phosphor-icons/react";

type StepProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function ReferralStep({ title, description, icon }: StepProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function ReferralPromoSection() {
  const t = useTranslations("Referral.Promo");

  return (
    <section className="relative z-10 py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-widest text-brand-primary">
              <Sparkle className="h-4 w-4" weight="fill" />
              {t("badge")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("sectionTitle")}
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl">
              {t("sectionSubtitle")}
            </p>

            <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-transparent p-6">
              <h3 className="text-lg font-semibold text-white">
                {t("bonusTitle")}
              </h3>
              <p className="text-sm text-zinc-400 mt-2">
                {t("bonusSubtitle", { signup: 2, payment: 10 })}
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/10">
                  {t("bonusBadgeSignup")}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10">
                  {t("bonusBadgePayment")}
                </span>
                <span className="text-zinc-400">{t("bonusCaption")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/account"
                className="px-6 py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition-colors"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <ReferralStep
              title={t("steps.invite.title")}
              description={t("steps.invite.desc")}
              icon={<ShareNetwork className="h-5 w-5" weight="fill" />}
            />
            <ReferralStep
              title={t("steps.signup.title")}
              description={t("steps.signup.desc")}
              icon={<UserPlus className="h-5 w-5" weight="fill" />}
            />
            <ReferralStep
              title={t("steps.pay.title")}
              description={t("steps.pay.desc")}
              icon={<Sparkle className="h-5 w-5" weight="fill" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

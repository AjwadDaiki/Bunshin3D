"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BunshinLogo } from "../ui/BunshinLogo";

export default function FooterNew() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");
  const tReferral = useTranslations("Referral.Promo");

  return (
    <footer className="relative border-t border-white/6 bg-[#0a0a0a]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BunshinLogo className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">
                <span className="text-white">{tNav("brandName")}</span>
                <span className="text-blue-500">{tNav("brandSuffix")}</span>
              </span>
            </div>
            <p className="text-sm text-neutral-500 mb-4">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("product")}</h3>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li>
                <Link href="/studio" className="hover:text-white transition-colors">
                  {tNav("studio")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {tNav("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("legal")}</h3>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {tNav("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {tNav("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal-mentions" className="hover:text-white transition-colors">
                  {t("mentions")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("support")}</h3>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  {t("account")}
                </Link>
              </li>
              <li>
                <a href="https://metalya.fr/contact" className="hover:text-white transition-colors">
                  {t("contact")}
                </a>
              </li>
              <li>
                <a href="https://metalya.fr/" className="hover:text-white transition-colors">
                  {t("blog")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative mt-12 rounded-xl border border-white/6 bg-[#111] p-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
          <p className="text-sm text-neutral-300 font-medium relative">
            {tReferral("footerTitle")}
          </p>
          <Link
            href="/account"
            className="relative px-5 py-2.5 rounded-lg bg-white text-neutral-950 font-semibold hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/5 transition-all text-sm"
          >
            {tReferral("footerCta")}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>{t("crafted")}</span>
            <a
              href="https://hiddenlab.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {t("partnerName")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

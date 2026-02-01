"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Hexagon } from "@phosphor-icons/react";
import { BunshinLogo } from "../ui/BunshinLogo";

export default function FooterNew() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");
  const tReferral = useTranslations("Referral.Promo");

  return (
    <footer className="relative  border-t border-white/10 bg-surface-1">
      <div className="absolute inset-0 bg-neutral-950 pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BunshinLogo className="h-6 w-6 text-brand-primary" />
              <span className="text-lg font-bold">
                <span className="text-gradient-brand">{tNav("brandName")}</span>
                <span className="text-brand-accent">{tNav("brandSuffix")}</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/studio"
                  className="hover:text-brand-primary transition-colors"
                >
                  {tNav("studio")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-brand-primary transition-colors"
                >
                  {tNav("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-brand-primary transition-colors"
                >
                  {tNav("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-brand-primary transition-colors"
                >
                  {tNav("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-mentions"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("mentions")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/account"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("account")}
                </Link>
              </li>
              <li>
                <a
                  href="https://metalya.fr/contact"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("contact")}
                </a>
              </li>
              <li>
                <a
                  href="https://metalya.fr/"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("blog")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-linear-to-r from-brand-primary/10 via-white/5 to-cyan-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm md:text-base text-white/90 font-medium">
            {tReferral("footerTitle")}
          </p>
          <Link
            href="/account"
            className="px-4 py-2 rounded-full bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition-colors"
          >
            {tReferral("footerCta")}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{t("crafted")}</span>
            <a
              href="https://hiddenlab.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
            >
              <Hexagon
                className="w-3 h-3 text-indigo-500 group-hover:rotate-180 transition-transform duration-700"
                weight="fill"
              />
              <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">
                {t("partnerName")}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

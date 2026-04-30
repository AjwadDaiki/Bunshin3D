"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BunshinLogo } from "../ui/BunshinLogo";

export default function FooterNew() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="relative border-t border-white/6 bg-[#0a0a0a]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-5">
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
              <li>
                <Link href="/use-cases" className="hover:text-white transition-colors">
                  {tNav("useCases")}
                </Link>
              </li>
              <li>
                <Link href="/formats" className="hover:text-white transition-colors">
                  {t("formats")}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  {t("compare")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t("tools")}</h3>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li>
                <Link href="/tools/image-to-stl" className="hover:text-white transition-colors">
                  {t("toolImageToStl")}
                </Link>
              </li>
              <li>
                <Link href="/tools/png-to-3d" className="hover:text-white transition-colors">
                  {t("toolPngTo3d")}
                </Link>
              </li>
              <li>
                <Link href="/tools/logo-to-3d" className="hover:text-white transition-colors">
                  {t("toolLogoTo3d")}
                </Link>
              </li>
              <li>
                <Link href="/tools/photo-to-3d-print" className="hover:text-white transition-colors">
                  {t("toolPhotoToPrint")}
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

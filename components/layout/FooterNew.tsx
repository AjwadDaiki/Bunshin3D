"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Github, Twitter, Linkedin, Hexagon } from "lucide-react";
// Import du logo personnalisé
import { BunshinLogo } from "../ui/BunshinLogo";

export default function FooterNew() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="relative mt-32 border-t border-white/10 bg-surface-1">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Remplacement de Sparkles par BunshinLogo */}
              <BunshinLogo className="h-6 w-6 text-brand-primary" />
              <span className="text-lg font-bold">
                <span className="text-gradient-brand">Bunshin</span>
                <span className="text-brand-accent">3D</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Transform your images into stunning 3D models with AI
            </p>
          </div>

          {/* Product */}
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
              <li>
                <Link
                  href="/#features"
                  className="hover:text-brand-primary transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
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
                  Legal Mentions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/account"
                  className="hover:text-brand-primary transition-colors"
                >
                  Account
                </Link>
              </li>
              <li>
                <a
                  href="https://metalya.fr/contact"
                  className="hover:text-brand-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://metalya.fr/"
                  className="hover:text-brand-primary transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
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
              <Hexagon className="w-3 h-3 text-indigo-500 group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">
                HiddenLab
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

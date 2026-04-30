"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sparkles, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const t = useTranslations("Footer");
  const navT = useTranslations("Navigation");


  const footerLinks = {
    product: [
      { label: t("studio"), href: "/studio" },
      { label: t("pricing"), href: "/pricing" },
    ],
    legal: [
      { label: t("terms"), href: "/terms" },
      { label: t("privacy"), href: "/privacy" },
      { label: t("mentions"), href: "/legal-mentions" },
    ],
    resources: [

      { label: t("blog"), href: "https://metalya.fr" },
      { label: t("help"), href: "https://metalya.fr/contact" },
    ],
  };

  return (
    <footer className="relative bg-zinc-950 pt-24 pb-12 border-t border-white/5 overflow-hidden">
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                {navT("brandName")}
                <span className="text-zinc-600">3D</span>
              </span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-sm">
              {t("brandDesc")}
            </p>
          </div>

          {}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {}
            <div>
              <h4 className="text-white font-bold mb-6">{t("product")}</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {}
            <div>
              <h4 className="text-white font-bold mb-6">{t("resources")}</h4>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {}
            <div>
              <h4 className="text-white font-bold mb-6">{t("legal")}</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-indigo-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          {}
          <div className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Bunshin 3D. {t("rights")}
          </div>

          {}
        </div>
      </div>
    </footer>
  );
}

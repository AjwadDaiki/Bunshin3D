import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Liste exhaustive pour le SEO
  locales: ["fr", "en", "es", "de", "ja", "zh"],

  // ANGLAIS PAR DÉFAUT comme demandé
  defaultLocale: "en",

  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

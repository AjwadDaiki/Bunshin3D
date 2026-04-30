import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { USE_CASE_SLUGS } from "@/lib/use-cases-data";
import { FORMAT_SLUGS } from "@/lib/formats-data";
import { COMPARE_SLUGS } from "@/lib/compare-data";
import { AUDIENCE_SLUGS } from "@/lib/audience-data";
import { TOOL_SLUGS } from "@/lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";
  const ogImage = `${baseUrl}/og-image.jpg`;

  const mainRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const, images: [ogImage] },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const, images: [ogImage] },
    { path: "/use-cases", priority: 0.8, changeFrequency: "weekly" as const, images: [ogImage] },
    { path: "/formats", priority: 0.8, changeFrequency: "weekly" as const, images: [ogImage] },
    { path: "/compare", priority: 0.7, changeFrequency: "weekly" as const, images: [ogImage] },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" as const, images: [ogImage] },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const, images: [] },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const, images: [] },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const, images: [] },
    { path: "/legal-mentions", priority: 0.3, changeFrequency: "yearly" as const, images: [] },
  ];

  const dynamicRoutes = [
    ...USE_CASE_SLUGS.map((slug) => ({ prefix: "/use-cases", slug, priority: 0.8 })),
    ...FORMAT_SLUGS.map((slug) => ({ prefix: "/formats", slug, priority: 0.8 })),
    ...COMPARE_SLUGS.map((slug) => ({ prefix: "/compare", slug, priority: 0.7 })),
    ...AUDIENCE_SLUGS.map((slug) => ({ prefix: "/for", slug, priority: 0.7 })),
    ...TOOL_SLUGS.map((slug) => ({ prefix: "/tools", slug, priority: 0.9 })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (
    locale: string,
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly",
    images: string[],
  ) => {
    const alternates: Record<string, string> = {};
    routing.locales.forEach((loc) => {
      alternates[loc] = `${baseUrl}/${loc}${path}`;
    });
    alternates["x-default"] = `${baseUrl}/en${path}`;

    entries.push({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: alternates },
      ...(images.length ? { images } : {}),
    });
  };

  routing.locales.forEach((locale) => {
    mainRoutes.forEach((route) => {
      addEntry(locale, route.path, route.priority, route.changeFrequency, route.images);
    });

    dynamicRoutes.forEach((route) => {
      addEntry(locale, `${route.prefix}/${route.slug}`, route.priority, "weekly", [ogImage]);
    });
  });

  return entries;
}

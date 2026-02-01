import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";

  const privatePages = [
    "/*/studio",
    "/*/account",
    "/*/admin",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [...privatePages, "/*?*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: privatePages,
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: privatePages,
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        allow: ["/*/pricing", "/*/terms", "/*/privacy", "/*/legal-mentions"],
        disallow: [...privatePages, "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: [...privatePages, "/api/"],
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: [...privatePages, "/api/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...privatePages,
          "/_next/",
          "/static/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

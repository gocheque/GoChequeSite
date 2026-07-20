import type { MetadataRoute } from "next";
import { getSiteUrl, siteConfig } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/fr/dashboard",
          "/en/dashboard",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: getSiteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}

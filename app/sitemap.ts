import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

function localeAlternates(frPath: string, enPath: string) {
  return {
    languages: {
      "fr-CA": getSiteUrl(frPath),
      "en-CA": getSiteUrl(enPath),
      "x-default": getSiteUrl(frPath),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: getSiteUrl("/fr"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: localeAlternates("/fr", "/en"),
    },
    {
      url: getSiteUrl("/en"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: localeAlternates("/fr", "/en"),
    },
    {
      url: getSiteUrl("/fr/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/terms", "/en/terms"),
    },
    {
      url: getSiteUrl("/en/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/terms", "/en/terms"),
    },
    {
      url: getSiteUrl("/fr/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/privacy", "/en/privacy"),
    },
    {
      url: getSiteUrl("/en/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/privacy", "/en/privacy"),
    },
    {
      url: getSiteUrl("/fr/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/contact", "/en/contact"),
    },
    {
      url: getSiteUrl("/en/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: localeAlternates("/fr/contact", "/en/contact"),
    },
  ];
}

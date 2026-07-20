import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: getSiteUrl("/fr"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr"),
          "en-CA": getSiteUrl("/en"),
        },
      },
    },
    {
      url: getSiteUrl("/en"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr"),
          "en-CA": getSiteUrl("/en"),
        },
      },
    },
    {
      url: getSiteUrl("/fr/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/terms"),
          "en-CA": getSiteUrl("/en/terms"),
        },
      },
    },
    {
      url: getSiteUrl("/en/terms"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/terms"),
          "en-CA": getSiteUrl("/en/terms"),
        },
      },
    },
    {
      url: getSiteUrl("/fr/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/privacy"),
          "en-CA": getSiteUrl("/en/privacy"),
        },
      },
    },
    {
      url: getSiteUrl("/en/privacy"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/privacy"),
          "en-CA": getSiteUrl("/en/privacy"),
        },
      },
    },
    {
      url: getSiteUrl("/fr/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/contact"),
          "en-CA": getSiteUrl("/en/contact"),
        },
      },
    },
    {
      url: getSiteUrl("/en/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          "fr-CA": getSiteUrl("/fr/contact"),
          "en-CA": getSiteUrl("/en/contact"),
        },
      },
    },
  ];
}

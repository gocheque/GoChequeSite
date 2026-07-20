import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";
import { htmlLang } from "@/lib/i18n/config";
import { getSiteUrl, siteConfig } from "@/lib/seo/site";

type JsonLdObject = Record<string, unknown>;

const SOFTWARE_FEATURES: Record<Locale, string[]> = {
  fr: [
    "Chèques conformes CPA 006",
    "Bande MICR E-13B",
    "Impression recto-verso",
    "Données locales au navigateur",
  ],
  en: [
    "CPA 006 compliant cheques",
    "E-13B MICR band",
    "Duplex printing",
    "Browser-local data",
  ],
};

export function buildOrganizationJsonLd(
  description: string = siteConfig.description.fr,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: getSiteUrl(siteConfig.ogImage),
    description,
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
  };
}

export function buildWebSiteJsonLd(
  description: string = siteConfig.description.fr,
  locale: Locale = "fr",
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description,
    inLanguage: htmlLang(locale),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildSoftwareApplicationJsonLd(
  description: string = siteConfig.description.fr,
  locale: Locale = "fr",
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteConfig.url,
    description,
    inLanguage: htmlLang(locale),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    featureList: SOFTWARE_FEATURES[locale],
  };
}

export function buildFaqPageJsonLd(dictionary: Dictionary): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dictionary.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHomeJsonLd(
  dictionary: Dictionary,
  locale: Locale,
): JsonLdObject[] {
  const description = dictionary.meta.homeDescription;

  return [
    buildOrganizationJsonLd(description),
    buildWebSiteJsonLd(description, locale),
    buildSoftwareApplicationJsonLd(description, locale),
    buildFaqPageJsonLd(dictionary),
  ];
}

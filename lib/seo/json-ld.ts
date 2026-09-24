import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";
import { htmlLang } from "@/lib/i18n/config";
import { getSiteUrl, siteConfig } from "@/lib/seo/site";
import { PRIMARY_SITE_URL, ALTERNATE_SITE_URL } from "@/lib/seo/hosts";
import { CONTACT_EMAIL } from "@/lib/site/contact";
import { TOKEN_PACKAGES } from "@/lib/tokens/packages";

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
    url: PRIMARY_SITE_URL,
    sameAs: [PRIMARY_SITE_URL, ALTERNATE_SITE_URL],
    logo: getSiteUrl("/logo.png"),
    description,
    email: CONTACT_EMAIL,
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      availableLanguage: ["French", "English"],
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
    url: PRIMARY_SITE_URL,
    description,
    inLanguage: htmlLang(locale),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: PRIMARY_SITE_URL,
    },
  };
}

export function buildSoftwareApplicationJsonLd(
  description: string = siteConfig.description.fr,
  locale: Locale = "fr",
): JsonLdObject {
  const prices = TOKEN_PACKAGES.map((pkg) => pkg.priceCents / 100);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: PRIMARY_SITE_URL,
    description,
    inLanguage: htmlLang(locale),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: lowPrice.toFixed(2),
      highPrice: highPrice.toFixed(2),
      offerCount: TOKEN_PACKAGES.length,
      offers: TOKEN_PACKAGES.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        price: (pkg.priceCents / 100).toFixed(2),
        priceCurrency: "CAD",
        availability: "https://schema.org/InStock",
        url: PRIMARY_SITE_URL,
      })),
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

export function buildWebPageJsonLd(
  name: string,
  description: string,
  path: string,
  locale: Locale,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: getSiteUrl(path),
    inLanguage: htmlLang(locale),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: PRIMARY_SITE_URL,
    },
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

import type { Metadata, Viewport } from "next";
import type { Locale } from "@/lib/i18n/config";
import { htmlLang } from "@/lib/i18n/config";

const DEFAULT_SITE_URL = "https://gocheque.ca";

const OG_IMAGE = {
  path: "/og.jpg",
  width: 1424,
  height: 752,
} as const;

export const siteConfig = {
  name: "GoCheque",
  legalName: "GoCheque",
  tagline: {
    fr: "Chèques bancaires canadiens, prêts à imprimer",
    en: "Canadian bank cheques, ready to print",
  },
  description: {
    fr: "Générez et imprimez des chèques bancaires canadiens conformes CPA 006 pour le dépôt mobile — non destinés au dépôt en succursale.",
    en: "Generate and print CPA 006 compliant Canadian bank cheques for mobile deposit — not intended for in-branch deposit.",
  },
  keywords: {
    fr: [
      "chèque en ligne",
      "imprimer chèque",
      "chèque CPA 006",
      "générateur de chèque Canada",
      "chèque bancaire",
      "MICR E-13B",
      "impression chèque",
      "chèque personnalisé",
      "Payments Canada",
      "dépôt mobile chèque",
    ],
    en: [
      "online cheque",
      "print cheque",
      "CPA 006 cheque",
      "Canadian cheque generator",
      "bank cheque",
      "MICR E-13B",
      "cheque printing",
      "custom cheque",
      "Payments Canada",
      "mobile deposit cheque",
    ],
  },
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, ""),
  ogImage: OG_IMAGE.path,
} as const;

export function getSiteUrl(path = "", baseUrl = siteConfig.url): string {
  const base = baseUrl.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6633",
};

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  locale?: Locale;
  keywords?: readonly string[];
  noIndex?: boolean;
  siteUrl?: string;
};

function buildOpenGraph(
  title: string,
  description: string,
  path: string,
  locale: Locale = "fr",
  siteUrl = siteConfig.url,
): NonNullable<Metadata["openGraph"]> {
  const tagline = siteConfig.tagline[locale];

  return {
    type: "website",
    locale: htmlLang(locale),
    url: getSiteUrl(path, siteUrl),
    siteName: siteConfig.name,
    title,
    description,
    images: [
      {
        url: getSiteUrl(OG_IMAGE.path, siteUrl),
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: `${siteConfig.name} — ${tagline}`,
      },
    ],
  };
}

function buildTwitter(
  title: string,
  description: string,
  locale: Locale = "fr",
  siteUrl = siteConfig.url,
): NonNullable<Metadata["twitter"]> {
  const tagline = siteConfig.tagline[locale];

  return {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: getSiteUrl(OG_IMAGE.path, siteUrl),
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: `${siteConfig.name} — ${tagline}`,
      },
    ],
  };
}

function resolvePageTitle(title: string): string {
  return title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
}

export function buildRootMetadata(siteUrl = siteConfig.url): Metadata {
  const locale: Locale = "fr";
  const title = `${siteConfig.name} — ${siteConfig.tagline[locale]}`;
  const description = siteConfig.description[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [...siteConfig.keywords[locale]],
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "finance",
    openGraph: buildOpenGraph(title, description, "/fr", locale, siteUrl),
    twitter: buildTwitter(title, description, locale, siteUrl),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/fr",
      languages: {
        "fr-CA": "/fr",
        "en-CA": "/en",
        "x-default": "/fr",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim(),
        }
      : undefined,
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  locale = "fr",
  keywords,
  noIndex = false,
  siteUrl = siteConfig.url,
}: PageMetadataOptions): Metadata {
  const resolvedDescription = description ?? siteConfig.description[locale];
  const fullTitle = resolvePageTitle(title);
  const resolvedKeywords = keywords ?? siteConfig.keywords[locale];

  const alternateFr = path.startsWith("/en")
    ? path.replace("/en", "/fr")
    : path.startsWith("/fr")
      ? path
      : `/fr${path === "/" ? "" : path}`;
  const alternateEn = path.startsWith("/fr")
    ? path.replace("/fr", "/en")
    : path.startsWith("/en")
      ? path
      : `/en${path === "/" ? "" : path}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: fullTitle },
    description: resolvedDescription,
    keywords: [...resolvedKeywords],
    alternates: {
      canonical: path,
      languages: {
        "fr-CA": alternateFr,
        "en-CA": alternateEn,
        "x-default": alternateFr,
      },
    },
    openGraph: buildOpenGraph(
      fullTitle,
      resolvedDescription,
      path,
      locale,
      siteUrl,
    ),
    twitter: buildTwitter(fullTitle, resolvedDescription, locale, siteUrl),
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : undefined,
  };
}

export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const LOCALE_COOKIE = "echeck_locale";

export function getLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]!) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    if (tag === "en" || tag.startsWith("en-")) return "en";
    if (tag === "fr" || tag.startsWith("fr-")) return "fr";
  }

  return defaultLocale;
}

export function getPreferredLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  if (cookieValue && isValidLocale(cookieValue)) return cookieValue;
  return getLocaleFromAcceptLanguage(acceptLanguage);
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return segment && isValidLocale(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;
  const rest = pathname.slice(locale.length + 1);
  return rest === "" ? "/" : rest;
}

export function htmlLang(locale: Locale): string {
  return locale === "fr" ? "fr-CA" : "en-CA";
}

import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  getLocaleFromPathname,
  isValidLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";

export async function getNotFoundLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-locale");
  if (fromHeader && isValidLocale(fromHeader)) return fromHeader;

  const referer = headerStore.get("referer");
  if (referer) {
    try {
      const fromPath = getLocaleFromPathname(new URL(referer).pathname);
      if (fromPath) return fromPath;
    } catch {
      // ignore invalid referer URL
    }
  }

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isValidLocale(fromCookie)) return fromCookie;

  return defaultLocale;
}

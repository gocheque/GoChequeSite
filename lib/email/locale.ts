import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";

export function localeFromUnknown(value: unknown): Locale {
  if (typeof value === "string" && isValidLocale(value)) return value;
  return "fr";
}

export function localeFromUserMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Locale {
  return localeFromUnknown(metadata?.locale);
}

export function localeFromPath(path: string | null | undefined): Locale {
  if (!path) return "fr";
  const segment = path.split("/").find(Boolean);
  return localeFromUnknown(segment);
}

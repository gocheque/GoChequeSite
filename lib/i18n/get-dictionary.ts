import type { Locale } from "@/lib/i18n/config";
import { defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { dictionary as en } from "@/lib/i18n/dictionaries/en";
import { dictionary as fr } from "@/lib/i18n/dictionaries/fr";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: string): Dictionary {
  const resolved = isValidLocale(locale) ? locale : defaultLocale;
  return dictionaries[resolved];
}

export type { Dictionary } from "@/lib/i18n/dictionary-type";

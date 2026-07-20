"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  htmlLang,
  localizedPath,
  stripLocaleFromPathname,
  type Locale,
} from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  t: TranslateFn;
  path: (href: string) => string;
};

type TranslateFn = (
  key: string,
  params?: Record<string, string | number>,
) => string;

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveKey(dictionary: Dictionary, key: string): string {
  const parts = key.split(".");
  let current: unknown = dictionary;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    params[name] != null ? String(params[name]) : `{${name}}`,
  );
}

function createTranslate(dictionary: Dictionary): TranslateFn {
  return (key, params) => interpolate(resolveKey(dictionary, key), params);
}

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const t = useMemo(() => createTranslate(dictionary), [dictionary]);

  const path = useCallback(
    (href: string) => {
      if (href.startsWith("http") || href.startsWith("#")) return href;
      const [pathname, hash = ""] = href.split("#");
      const localized = localizedPath(locale, pathname || "/");
      return hash ? `${localized}#${hash}` : localized;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, dictionary, t, path }),
    [locale, dictionary, t, path],
  );

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useLocalizedPath() {
  return useLocale().path;
}

export { stripLocaleFromPathname };

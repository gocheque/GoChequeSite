"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocaleFromPathname, useLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";

export function LocaleSwitcher() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  function hrefFor(target: Locale) {
    return localizedPath(target, pathWithoutLocale);
  }

  return (
    <div
      role="group"
      aria-label={t("locale.label")}
      className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-xs font-semibold"
    >
      <Link
        href={hrefFor("fr")}
        className={`px-2.5 py-1.5 transition ${
          locale === "fr"
            ? "bg-[#ff6633] text-white"
            : "text-slate-600 hover:bg-slate-50"
        }`}
        aria-current={locale === "fr" ? "true" : undefined}
      >
        FR
      </Link>
      <Link
        href={hrefFor("en")}
        className={`border-l border-slate-200 px-2.5 py-1.5 transition ${
          locale === "en"
            ? "bg-[#ff6633] text-white"
            : "text-slate-600 hover:bg-slate-50"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}

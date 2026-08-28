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
      className="flex h-8 shrink-0 overflow-hidden rounded-md border border-[#e7e4de] bg-white text-xs font-semibold leading-none"
    >
      <Link
        href={hrefFor("fr")}
        className={`flex h-full items-center px-2.5 transition ${
          locale === "fr"
            ? "bg-[#0b1f33] text-white"
            : "text-[#5c6b7a] hover:bg-[#0b1f33]/[0.03]"
        }`}
        aria-current={locale === "fr" ? "true" : undefined}
      >
        FR
      </Link>
      <Link
        href={hrefFor("en")}
        className={`flex h-full items-center border-l border-[#e7e4de] px-2.5 transition ${
          locale === "en"
            ? "bg-[#0b1f33] text-white"
            : "text-[#5c6b7a] hover:bg-[#0b1f33]/[0.03]"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}

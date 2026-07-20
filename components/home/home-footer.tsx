"use client";

import Link from "next/link";
import { AppBrandName } from "@/components/brand/app-brand-name";
import { AppLogo } from "@/components/brand/app-logo";
import { useLocale } from "@/components/providers/locale-provider";

export function HomeFooter() {
  const { t, path } = useLocale();

  return (
    <footer className="border-t border-slate-100/80 bg-white/60 py-10 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Link href={path("/")} className="group flex items-center gap-3">
          <AppLogo
            alt={t("nav.logoAlt")}
            className="h-8 w-auto max-w-[7rem] object-contain transition group-hover:scale-[1.02] sm:max-w-[8rem]"
          />
          <AppBrandName className="text-xl" />
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:justify-end">
          <Link
            href={path("/contact")}
            className="text-slate-500 transition hover:text-slate-800"
          >
            {t("footer.contact")}
          </Link>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <Link
            href={path("/privacy")}
            className="text-slate-500 transition hover:text-slate-800"
          >
            {t("footer.privacy")}
          </Link>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <Link
            href={path("/terms")}
            className="text-slate-500 transition hover:text-slate-800"
          >
            {t("footer.terms")}
          </Link>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="text-slate-400">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
}

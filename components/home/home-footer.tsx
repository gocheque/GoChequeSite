"use client";

import Link from "next/link";
import { AppBrandName } from "@/components/brand/app-brand-name";
import { AppLogo } from "@/components/brand/app-logo";
import { useLocale } from "@/components/providers/locale-provider";

export function HomeFooter() {
  const { t, path, dictionary } = useLocale();
  const anchors = dictionary.anchors;

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand & Tagline */}
          <div className="max-w-sm text-center md:text-left">
            <Link href={path("/")} className="group inline-flex items-center gap-2.5">
              <AppLogo
                alt={t("nav.logoAlt")}
                className="h-8 w-auto max-w-[7.5rem] object-contain transition group-hover:scale-[1.02]"
              />
              <AppBrandName className="text-xl" />
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Nav & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 md:justify-end">
            <Link href={path(`/#${anchors.gallery}`)} className="transition hover:text-[#ff6633]">
              {t("nav.preview")}
            </Link>
            <Link href={path(`/#${anchors.features}`)} className="transition hover:text-[#ff6633]">
              {t("nav.features")}
            </Link>
            <Link href={path(`/#${anchors.pricing}`)} className="transition hover:text-[#ff6633]">
              {t("nav.pricing")}
            </Link>
            <Link href={path(`/#${anchors.faq}`)} className="transition hover:text-[#ff6633]">
              {t("nav.faq")}
            </Link>
            <Link href={path("/contact")} className="transition hover:text-[#ff6633]">
              {t("footer.contact")}
            </Link>
            <Link href={path("/privacy")} className="transition hover:text-[#ff6633]">
              {t("footer.privacy")}
            </Link>
            <Link href={path("/terms")} className="transition hover:text-[#ff6633]">
              {t("footer.terms")}
            </Link>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-10 border-t border-slate-200/60 pt-8 text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="max-w-2xl text-[11px] leading-relaxed text-slate-400">
            {t("footer.disclaimer")}
          </p>
          <p className="mt-4 text-[11px] font-medium text-slate-500 md:mt-0 md:shrink-0">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}

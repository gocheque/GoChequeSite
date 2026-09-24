import Link from "next/link";
import { AppBrandName } from "@/components/brand/app-brand-name";
import { AppLogo } from "@/components/brand/app-logo";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type NotFoundContentProps = {
  locale: Locale;
  dict: Dictionary;
};

export function NotFoundContent({ locale, dict }: NotFoundContentProps) {
  const { notFound } = dict;

  return (
    <main className="marketing-shell flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <Link
          href={localizedPath(locale)}
          className="inline-flex flex-col items-center gap-3"
        >
          <AppLogo alt={dict.nav.logoAlt} className="h-10 w-auto object-contain" />
          <AppBrandName className="text-xl tracking-tight" />
        </Link>

        <p className="mt-12 text-xs font-medium uppercase tracking-[0.18em] text-[#ff6633]">
          {notFound.code}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f33]">
          {notFound.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#5b6b7c] sm:text-base">
          {notFound.description}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={localizedPath(locale)}
            className="rounded-md bg-[#0b1f33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16324c]"
          >
            {notFound.backHome}
          </Link>
          <Link
            href={localizedPath(locale, "/dashboard")}
            className="rounded-md border border-[#e7e4de] px-5 py-3 text-sm font-semibold text-[#0b1f33] transition hover:border-[#0b1f33]/30"
          >
            {notFound.backDashboard}
          </Link>
        </div>
      </div>
    </main>
  );
}

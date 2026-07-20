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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <Link
          href={localizedPath(locale)}
          className="inline-flex flex-col items-center gap-3 transition hover:opacity-90"
        >
          <AppLogo alt={dict.nav.logoAlt} className="h-10 w-auto object-contain" />
          <AppBrandName className="text-xl" />
        </Link>

        <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-[#ff6633]">
          {notFound.code}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {notFound.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {notFound.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={localizedPath(locale)}
            className="rounded-lg bg-[#ff6633] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e05526]"
          >
            {notFound.backHome}
          </Link>
          <Link
            href={localizedPath(locale, "/dashboard")}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            {notFound.backDashboard}
          </Link>
        </div>
      </div>
    </main>
  );
}

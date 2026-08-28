import Link from "next/link";
import { AppBrandName } from "@/components/brand/app-brand-name";
import { AppLogo } from "@/components/brand/app-logo";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

type HomeFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HomeFooter({ locale, dictionary }: HomeFooterProps) {
  const path = (href: string) => localizedPath(locale, href);
  const year = new Date().getFullYear();
  const copyright = dictionary.footer.copyright.replace("{year}", String(year));

  return (
    <footer className="border-t border-[#eeeae3] bg-white py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:items-start sm:px-6 lg:px-8">
        <Link href={path("/")} className="flex items-center gap-3">
          <AppLogo
            alt={dictionary.nav.logoAlt}
            className="h-8 w-auto max-w-[7rem] object-contain sm:max-w-[8rem]"
          />
          <AppBrandName className="text-lg tracking-tight" />
        </Link>
        <div className="flex flex-col items-center gap-3 text-sm sm:items-end">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              href={path("/contact")}
              className="text-[#3d4f63] transition hover:text-[#0b1f33]"
            >
              {dictionary.footer.contact}
            </Link>
            <Link
              href={path("/privacy")}
              className="text-[#3d4f63] transition hover:text-[#0b1f33]"
            >
              {dictionary.footer.privacy}
            </Link>
            <Link
              href={path("/terms")}
              className="text-[#3d4f63] transition hover:text-[#0b1f33]"
            >
              {dictionary.footer.terms}
            </Link>
          </div>
          <p className="text-xs text-[#8a8073]">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

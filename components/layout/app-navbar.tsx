"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBrandName } from "@/components/brand/app-brand-name";
import { AppLogo } from "@/components/brand/app-logo";
import { AuthMenu } from "@/components/auth/auth-menu";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useLocale } from "@/components/providers/locale-provider";

type NavLink = {
  href: string;
  label: string;
};

function NavLinks({
  links,
  pathname,
  activeStyle,
}: {
  links: NavLink[];
  pathname: string | null;
  activeStyle: boolean;
}) {
  return (
    <>
      {links.map((link) => {
        const isActive = activeStyle && pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-[#ff6633]"
                : "text-sm font-medium text-slate-600 transition hover:text-slate-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function AppNavbar() {
  const pathname = usePathname();
  const { t, path, dictionary } = useLocale();
  const anchors = dictionary.anchors;
  const isDashboard = pathname?.includes("/dashboard");

  const homeLinks: NavLink[] = [
    { href: path(`/#${anchors.gallery}`), label: t("nav.preview") },
    { href: path(`/#${anchors.features}`), label: t("nav.features") },
    { href: path(`/#${anchors.pricing}`), label: t("nav.pricing") },
    { href: path(`/#${anchors.faq}`), label: t("nav.faq") },
  ];

  const dashboardLinks: NavLink[] = [
    { href: path("/dashboard"), label: t("nav.dashboard") },
    { href: path("/dashboard/keys"), label: t("nav.myCredits") },
    { href: path("/dashboard/account"), label: t("nav.myAccount") },
  ];

  const navLinks = isDashboard ? dashboardLinks : homeLinks;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-4xl px-4">
      <nav
        aria-label={isDashboard ? t("dashboard.navLabel") : t("nav.main")}
        className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-[0_4px_24px_rgb(0,0,0,0.06)] backdrop-blur-md sm:px-5"
      >
        <div className="flex items-center justify-between gap-3">
          <Link href={path("/")} className="group flex shrink-0 items-center gap-2.5">
            <AppLogo
              alt={t("nav.logoAlt")}
              className="h-7 w-auto max-w-[5.5rem] object-contain transition group-hover:scale-[1.02] sm:max-w-[6.5rem] sm:h-8"
            />
            <AppBrandName className="text-lg sm:text-lg" />
          </Link>

          <div className="hidden items-center gap-4 md:flex md:gap-6">
            <NavLinks
              links={navLinks}
              pathname={pathname}
              activeStyle={isDashboard}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher />
            <AuthMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}

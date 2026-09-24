"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  onNavigate,
  stacked = false,
}: {
  links: NavLink[];
  pathname: string | null;
  activeStyle: boolean;
  onNavigate?: () => void;
  stacked?: boolean;
}) {
  return (
    <>
      {links.map((link) => {
        const isActive = activeStyle && pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={
              stacked
                ? `block rounded-lg px-3 py-3 text-base font-medium ${
                    isActive
                      ? "bg-[#0b1f33]/5 text-[#0b1f33]"
                      : "text-[#3d4f63] hover:bg-[#0b1f33]/[0.04] hover:text-[#0b1f33]"
                  }`
                : isActive
                  ? "text-sm font-medium text-[#0b1f33]"
                  : "text-sm font-medium text-[#3d4f63] transition hover:text-[#0b1f33]"
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-5xl px-4">
      <nav
        aria-label={isDashboard ? t("dashboard.navLabel") : t("nav.main")}
        className="flex items-center justify-between gap-3 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-[0_4px_20px_rgb(0,0,0,0.05)] ring-1 ring-slate-900/5 backdrop-blur-md sm:px-5"
      >
        <Link href={path("/")} className="group flex shrink-0 items-center gap-2.5">
          <AppLogo
            alt={t("nav.logoAlt")}
            className="h-7 w-auto max-w-[5.5rem] object-contain sm:h-8 sm:max-w-[6.5rem]"
          />
          <AppBrandName className="hidden text-[1.05rem] tracking-tight min-[400px]:inline" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLinks
            links={navLinks}
            pathname={pathname}
            activeStyle={isDashboard}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <AuthMenu />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md border border-[#e7e4de] text-[#0b1f33] md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id={menuId}
          className="border-t border-[#e7e4de] bg-white md:hidden"
        >
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <NavLinks
              links={navLinks}
              pathname={pathname}
              activeStyle={isDashboard}
              stacked
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

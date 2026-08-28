"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { localizedPath } from "@/lib/i18n/config";

function SignOutConfirmModal({
  open,
  signingOut,
  onCancel,
  onConfirm,
  t,
}: {
  open: boolean;
  signingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="marketing-shell fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-[#0b1f33]/40 backdrop-blur-sm"
        onClick={() => !signingOut && onCancel()}
      />
      <div className="relative w-full max-w-sm rounded-lg border border-[#e7e4de] bg-white p-6 shadow-[0_24px_80px_rgba(11,31,51,0.18)]">
        <ModalCloseButton
          onClick={onCancel}
          disabled={signingOut}
          className="absolute right-4 top-4"
        />

        <h2 className="pr-8 text-center text-xl font-semibold tracking-tight text-[#0b1f33]">
          {t("auth.signOutConfirm")}
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={signingOut}
            onClick={onCancel}
            className="w-full rounded-md border border-[#e7e4de] px-4 py-2.5 text-sm font-medium text-[#0b1f33] transition hover:bg-[#0b1f33]/[0.03] disabled:opacity-50"
          >
            {t("auth.cancel")}
          </button>
          <button
            type="button"
            disabled={signingOut}
            onClick={onConfirm}
            className="w-full rounded-md bg-[#0b1f33] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#16324c] disabled:opacity-50"
          >
            {signingOut ? t("auth.signingOut") : t("auth.signOutAction")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function menuLinkClass(isActive: boolean) {
  return `block rounded-md px-3 py-2.5 text-sm transition ${
    isActive
      ? "bg-[#0b1f33]/5 font-medium text-[#0b1f33]"
      : "text-[#3d4f63] hover:bg-[#0b1f33]/[0.04] hover:text-[#0b1f33]"
  }`;
}

/** Même footprint que le sélecteur FR/EN (h-8 / rounded-md). */
const headerIconBtnClass =
  "flex size-8 shrink-0 items-center justify-center rounded-md border border-[#e7e4de] bg-white p-0 leading-none transition hover:border-[#0b1f33]/30 hover:bg-[#0b1f33]/[0.03]";

export function AuthMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t, path } = useLocale();
  const { user, isLoading, signOut, openAuthModal } = useAuth();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  function openSignOutModal() {
    closeMenu();
    setSignOutOpen(true);
  }

  async function confirmSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      setSignOutOpen(false);
      router.replace(localizedPath(locale));
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        aria-label={t("nav.signIn")}
        className={`${headerIconBtnClass} text-slate-300`}
      >
        <UserRound className="size-4" strokeWidth={2} aria-hidden />
      </button>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        aria-label={t("nav.signIn")}
        className={`${headerIconBtnClass} text-slate-700 hover:shadow-sm`}
      >
        <UserRound className="size-4" strokeWidth={2} aria-hidden />
      </button>
    );
  }

  const initial = (user.email?.[0] ?? "U").toUpperCase();
  const dashboardHref = path("/dashboard");
  const keysHref = path("/dashboard/keys");
  const accountHref = path("/dashboard/account");
  const showDashboardLink = pathname !== dashboardHref;

  return (
    <>
      <details
        ref={menuRef}
        className="group relative shrink-0 [&_summary::-webkit-details-marker]:hidden"
      >
        <summary
          aria-label={t("nav.accountMenu")}
          className={`${headerIconBtnClass} cursor-pointer list-none text-xs font-bold text-[#0b1f33]`}
        >
          {initial}
        </summary>
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-[#e7e4de] bg-white shadow-[0_16px_48px_rgba(11,31,51,0.12)]">
          <p className="border-b border-[#e7e4de] px-4 py-3 text-xs text-[#5c6b7a]">
            {user.email}
          </p>
          <nav className="p-2">
            {showDashboardLink ? (
              <Link
                href={dashboardHref}
                onClick={closeMenu}
                className={menuLinkClass(pathname === dashboardHref)}
              >
                {t("nav.dashboard")}
              </Link>
            ) : null}

            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a8074]">
              {t("nav.accountSection")}
            </p>
            <Link
              href={accountHref}
              onClick={closeMenu}
              className={menuLinkClass(pathname === accountHref)}
            >
              {t("nav.myAccount")}
            </Link>
            <Link
              href={keysHref}
              onClick={closeMenu}
              className={menuLinkClass(pathname === keysHref)}
            >
              {t("nav.myCredits")}
            </Link>

            <div className="my-2 border-t border-[#e7e4de]" />

            <button
              type="button"
              onClick={openSignOutModal}
              className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[#3d4f63] transition hover:bg-[#0b1f33]/[0.04] hover:text-[#0b1f33]"
            >
              {t("nav.signOut")}
            </button>
          </nav>
        </div>
      </details>

      <SignOutConfirmModal
        open={signOutOpen}
        signingOut={signingOut}
        onCancel={() => setSignOutOpen(false)}
        onConfirm={confirmSignOut}
        t={t}
      />
    </>
  );
}

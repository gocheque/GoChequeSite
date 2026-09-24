"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { hasLegalConsent, saveLegalConsent } from "@/lib/legal/consent";

export function LegalConsentBanner() {
  const { t, path } = useLocale();
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasLegalConsent()) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.removeProperty("padding-bottom");
      document.documentElement.style.removeProperty("scroll-padding-bottom");
      return;
    }

    const banner = bannerRef.current;
    if (!banner) return;

    function syncOffset() {
      if (!banner) return;
      const height = `${banner.offsetHeight}px`;
      document.body.style.paddingBottom = height;
      document.documentElement.style.scrollPaddingBottom = height;
    }

    function clearOffset() {
      document.body.style.removeProperty("padding-bottom");
      document.documentElement.style.removeProperty("scroll-padding-bottom");
    }

    syncOffset();
    const observer = new ResizeObserver(syncOffset);
    observer.observe(banner);
    window.addEventListener("resize", syncOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncOffset);
      clearOffset();
    };
  }, [visible]);

  if (!visible) return null;

  function handleAccept() {
    saveLegalConsent();
    setVisible(false);
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="legal-consent-title"
      aria-describedby="legal-consent-description"
      className="marketing-shell fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e4de] bg-white/95 px-4 py-3 shadow-[0_-12px_40px_rgba(11,31,51,0.08)] backdrop-blur-md sm:px-6 sm:py-4"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 max-w-3xl">
          <p
            id="legal-consent-title"
            className="text-sm font-semibold text-[#0b1f33]"
          >
            {t("consent.title")}
          </p>
          <p
            id="legal-consent-description"
            className="mt-1 text-xs leading-relaxed text-[#5b6b7c] sm:text-sm"
          >
            {t("consent.cookies")}{" "}
            {t("consent.terms")}{" "}
            <Link
              href={path("/terms")}
              className="font-semibold text-[#0b1f33] underline decoration-[#ff6633] underline-offset-4 hover:text-[#ff6633]"
            >
              {t("footer.terms")}
            </Link>{" "}
            {t("consent.and")}{" "}
            <Link
              href={path("/privacy")}
              className="font-semibold text-[#0b1f33] underline decoration-[#ff6633] underline-offset-4 hover:text-[#ff6633]"
            >
              {t("footer.privacy")}
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 rounded-md bg-[#0b1f33] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16324c] sm:min-w-[8rem]"
        >
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}

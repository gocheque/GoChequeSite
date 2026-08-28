"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { hasLegalConsent, saveLegalConsent } from "@/lib/legal/consent";

export function LegalConsentBanner() {
  const { t, path } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasLegalConsent()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function handleAccept() {
    saveLegalConsent();
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="legal-consent-title"
      aria-describedby="legal-consent-description"
      className="marketing-shell fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e4de] bg-white/95 px-4 py-5 shadow-[0_-12px_40px_rgba(11,31,51,0.08)] backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0 max-w-3xl">
          <p
            id="legal-consent-title"
            className="text-sm font-semibold text-[#0b1f33]"
          >
            {t("consent.title")}
          </p>
          <p
            id="legal-consent-description"
            className="mt-2 text-sm leading-relaxed text-[#5b6b7c]"
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
          className="shrink-0 rounded-md bg-[#0b1f33] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16324c] sm:min-w-[8rem]"
        >
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}

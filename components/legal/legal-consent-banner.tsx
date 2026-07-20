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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_-8px_32px_rgb(0,0,0,0.08)] backdrop-blur-md sm:px-6 sm:py-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p
            id="legal-consent-title"
            className="text-sm font-semibold text-slate-900"
          >
            {t("consent.title")}
          </p>
          <p
            id="legal-consent-description"
            className="mt-1 text-sm leading-relaxed text-slate-600"
          >
            {t("consent.cookies")}{" "}
            {t("consent.terms")}{" "}
            <Link
              href={path("/terms")}
              className="font-semibold text-[#ff6633] underline-offset-2 hover:underline"
            >
              {t("footer.terms")}
            </Link>{" "}
            {t("consent.and")}{" "}
            <Link
              href={path("/privacy")}
              className="font-semibold text-[#ff6633] underline-offset-2 hover:underline"
            >
              {t("footer.privacy")}
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 rounded-lg bg-[#ff6633] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e05526] sm:min-w-[7.5rem]"
        >
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}

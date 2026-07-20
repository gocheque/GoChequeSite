"use client";

import { useEffect, useState } from "react";
import { Loader2, Printer, Smartphone } from "lucide-react";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { printChequeInPage } from "@/lib/cheque/print-cheque";
import {
  setPrintMobileListener,
} from "@/lib/cheque/print-mobile-bridge";

export function ChequePrintMobileModal() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    setPrintMobileListener((nextLocale) => {
      setLocale(nextLocale);
      setOpen(true);
    });

    return () => setPrintMobileListener(null);
  }, []);

  function closeModal() {
    setOpen(false);
  }

  function handlePrint() {
    if (printing) return;
    setPrinting(true);
    void printChequeInPage(locale)
      .catch(() => undefined)
      .finally(() => setPrinting(false));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheque-print-mobile-title"
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-2xl sm:rounded-2xl"
      >
        <ModalCloseButton onClick={closeModal} className="absolute right-4 top-4" />

        <div className="overflow-y-auto px-6 pb-6 pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ff6633]">
            <Smartphone className="h-6 w-6" aria-hidden />
          </div>

          <h2
            id="cheque-print-mobile-title"
            className="mt-4 text-center text-xl font-bold text-slate-900"
          >
            {t("process.mobilePrint.title")}
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
            {t("process.mobilePrint.intro")}
          </p>

          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#ff6633]">
                1
              </span>
              <span>{t("process.mobilePrint.step1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#ff6633]">
                2
              </span>
              <span>{t("process.mobilePrint.step2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-[#ff6633]">
                3
              </span>
              <span>{t("process.mobilePrint.step3")}</span>
            </li>
          </ol>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-4">
          <button
            type="button"
            onClick={handlePrint}
            disabled={printing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6633] py-3.5 text-base font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {printing ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <Printer className="h-5 w-5" aria-hidden />
            )}
            {t("process.mobilePrint.printButton")}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t("process.mobilePrint.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

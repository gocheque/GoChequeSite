"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2, Share2, Smartphone } from "lucide-react";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/config";
import { generateChequePrintPdf } from "@/lib/cheque/generate-print-pdf";
import { setPrintMobileListener } from "@/lib/cheque/print-mobile-bridge";

const PDF_FILENAME = "gocheque-cheque.pdf";

function canNativeShareFiles() {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  if (typeof navigator.canShare !== "function") return true;
  try {
    const probe = new File([new Blob(["x"], { type: "application/pdf" })], PDF_FILENAME, {
      type: "application/pdf",
    });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

function triggerDownload(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = PDF_FILENAME;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function ChequePrintMobileModal() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("fr");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [shareAvailable, setShareAvailable] = useState(false);

  useEffect(() => {
    setPrintMobileListener((nextLocale) => {
      setLocale(nextLocale);
      setError(null);
      setDone(false);
      setPdfBlob(null);
      setShareAvailable(canNativeShareFiles());
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setOpen(true);
    });

    return () => setPrintMobileListener(null);
  }, []);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  function closeModal() {
    setOpen(false);
    setBusy(false);
    setError(null);
  }

  async function handleGenerate() {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const blob = await generateChequePrintPdf(locale);
      const objectUrl = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
      triggerDownload(objectUrl);
      setDone(true);
    } catch {
      setError(t("process.mobilePrint.generateError"));
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    if (!pdfBlob || !shareAvailable) return;
    try {
      const file = new File([pdfBlob], PDF_FILENAME, {
        type: "application/pdf",
      });
      await navigator.share({
        files: [file],
        title: "GoCheque",
        text: t("process.mobilePrint.shareText"),
      });
    } catch (err) {
      // Annulation utilisateur = normal
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(t("process.mobilePrint.shareError"));
    }
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
            {done ? (
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            ) : (
              <Smartphone className="h-6 w-6" aria-hidden />
            )}
          </div>

          <h2
            id="cheque-print-mobile-title"
            className="mt-4 text-center text-xl font-bold text-slate-900"
          >
            {done
              ? t("process.mobilePrint.successTitle")
              : t("process.mobilePrint.title")}
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
            {done
              ? t("process.mobilePrint.successIntro")
              : t("process.mobilePrint.intro")}
          </p>

          {!done ? (
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
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 p-4">
          {!done ? (
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6633] py-3.5 text-base font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              ) : (
                <Download className="h-5 w-5" aria-hidden />
              )}
              {busy
                ? t("process.mobilePrint.generating")
                : t("process.mobilePrint.generateButton")}
            </button>
          ) : (
            <>
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={PDF_FILENAME}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6633] py-3.5 text-base font-semibold text-white transition hover:bg-[#e05526]"
                >
                  <Download className="h-5 w-5" aria-hidden />
                  {t("process.mobilePrint.downloadButton")}
                </a>
              ) : null}
              {shareAvailable ? (
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Share2 className="h-4 w-4" aria-hidden />
                  {t("process.mobilePrint.shareButton")}
                </button>
              ) : null}
            </>
          )}

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

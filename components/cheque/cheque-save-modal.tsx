"use client";

import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { FloppyDiskIcon } from "@/components/cheque/floppy-disk-icon";
import { useLocale } from "@/components/providers/locale-provider";

type ChequeSaveModalProps = {
  open: boolean;
  onClose: () => void;
  savedAt: Date | null;
  saveFailed?: boolean;
};

export function ChequeSaveModal({
  open,
  onClose,
  savedAt,
  saveFailed = false,
}: ChequeSaveModalProps) {
  const { t, locale } = useLocale();

  if (!open) return null;

  function formatSavedAt(date: Date): string {
    return date.toLocaleString(locale === "fr" ? "fr-CA" : "en-CA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheque-save-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8"
      >
        <ModalCloseButton onClick={onClose} />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ff6633]">
          <FloppyDiskIcon className="h-6 w-6" />
        </div>

        <h2
          id="cheque-save-modal-title"
          className="mt-4 text-center text-xl font-bold text-slate-900"
        >
          {saveFailed ? t("editor.save.failedTitle") : t("editor.save.savedTitle")}
        </h2>

        {saveFailed ? (
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
            {t("editor.save.failedBody")}
          </p>
        ) : (
          <>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
              {t("editor.save.body1")}
            </p>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
              {t("editor.save.body2")}
            </p>
            {savedAt && (
              <p className="mt-4 text-center text-xs text-slate-400">
                {t("editor.save.lastSaved", {
                  date: formatSavedAt(savedAt),
                })}
              </p>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#ff6633] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e05526]"
        >
          {t("editor.save.confirm")}
        </button>
      </div>
    </div>
  );
}

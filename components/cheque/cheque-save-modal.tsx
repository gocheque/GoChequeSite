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
    <div className="marketing-shell fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-[#0b1f33]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheque-save-modal-title"
        className="relative w-full max-w-md rounded-lg border border-[#e7e4de] bg-white p-6 shadow-[0_24px_80px_rgba(11,31,51,0.18)] sm:p-8"
      >
        <ModalCloseButton onClick={onClose} />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#0b1f33]/5 text-[#0b1f33]">
          <FloppyDiskIcon className="h-6 w-6" />
        </div>

        <h2
          id="cheque-save-modal-title"
          className="mt-4 text-center text-xl font-semibold tracking-tight text-[#0b1f33]"
        >
          {saveFailed ? t("editor.save.failedTitle") : t("editor.save.savedTitle")}
        </h2>

        {saveFailed ? (
          <p className="mt-3 text-center text-sm leading-relaxed text-[#5c6b7a]">
            {t("editor.save.failedBody")}
          </p>
        ) : (
          <>
            <p className="mt-3 text-center text-sm leading-relaxed text-[#5c6b7a]">
              {t("editor.save.body1")}
            </p>
            <p className="mt-3 text-center text-sm leading-relaxed text-[#5c6b7a]">
              {t("editor.save.body2")}
            </p>
            {savedAt && (
              <p className="mt-4 text-center text-xs text-[#8a8074]">
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
          className="mt-6 w-full rounded-md bg-[#0b1f33] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16324c]"
        >
          {t("editor.save.confirm")}
        </button>
      </div>
    </div>
  );
}

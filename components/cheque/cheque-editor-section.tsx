"use client";

import { useEffect, useRef, useState } from "react";
import type { ChequeData } from "@/lib/cheque/cpa-format";
import {
  DEFAULT_CHEQUE_COLOR,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";
import { CHEQUE_EDITOR_FORM_ID } from "@/lib/cheque/cheque-form-autofill";
import {
  loadChequeDraft,
  saveChequeDraft,
  clearChequeDraft,
} from "@/lib/cheque/cheque-local-storage";
import { getEmptyCheque } from "@/lib/cheque/default-cheque";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ScaledChequePreview } from "@/components/cheque/scaled-cheque-preview";
import { ChequeEditorBar } from "@/components/cheque/cheque-editor-bar";
import { ChequeColorPicker } from "@/components/cheque/cheque-color-picker";
import { ChequeActionBar } from "@/components/cheque/cheque-action-bar";
import { ChequeSaveModal } from "@/components/cheque/cheque-save-modal";
import { ChequePreviewZoomModal } from "@/components/cheque/cheque-preview-zoom-modal";
import { FloppyDiskIcon } from "@/components/cheque/floppy-disk-icon";
import { ZoomIn } from "lucide-react";

type ChequeEditorSectionProps = {
  cheque: ChequeData;
  onFieldChange: <K extends keyof ChequeData>(
    key: K,
    value: ChequeData[K],
  ) => void;
  onClear?: () => void;
  variant?: "stack" | "split";
};

export function ChequeEditorSection({
  cheque,
  onFieldChange,
  onClear,
  variant = "stack",
}: ChequeEditorSectionProps) {
  const { t } = useLocale();
  const { startTraiterFlow } = useAuth();
  const [chequeColor, setChequeColor] =
    useState<ChequeColorId>(DEFAULT_CHEQUE_COLOR);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const draftLoadedRef = useRef(false);

  useEffect(() => {
    if (draftLoadedRef.current) return;
    draftLoadedRef.current = true;

    const draft = loadChequeDraft();
    if (!draft) return;

    (Object.keys(draft.cheque) as (keyof ChequeData)[]).forEach((key) => {
      if (key === "date" && !draft.cheque.date) return;
      onFieldChange(key, draft.cheque[key]);
    });
    setChequeColor(draft.color);
    setLastSavedAt(new Date(draft.savedAt));
  }, [onFieldChange]);

  function handleEditorSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTraiterFlow();
  }

  function handleSaveDraft() {
    const ok = saveChequeDraft(cheque, chequeColor);
    setSaveFailed(!ok);
    if (ok) {
      setLastSavedAt(new Date());
    }
    setSaveModalOpen(true);
  }

  function handleClear() {
    clearChequeDraft();
    setLastSavedAt(null);
    if (onClear) {
      onClear();
      return;
    }
    const empty = getEmptyCheque();
    (Object.keys(empty) as (keyof ChequeData)[]).forEach((key) => {
      onFieldChange(key, empty[key]);
    });
    if (cheque.accountMicrSlots) {
      onFieldChange("accountMicrSlots", undefined);
    }
  }

  const chromeButtonClass =
    "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e7e4de] bg-white px-3 text-sm font-medium text-[#0b1f33] transition hover:border-[#0b1f33]/30 hover:bg-[#0b1f33]/[0.03]";

  const previewPanel = (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8074]">
          {t("editor.previewZoom.title")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            aria-label={t("editor.save.ariaLabel")}
            title={t("editor.save.title")}
            className={chromeButtonClass}
          >
            <FloppyDiskIcon className="h-4 w-4" />
            {t("editor.save.title")}
          </button>
          <button
            type="button"
            onClick={() => setPreviewZoomOpen(true)}
            aria-label={t("editor.previewZoom.open")}
            className={`${chromeButtonClass} xl:hidden`}
          >
            <ZoomIn className="h-4 w-4" aria-hidden />
            {t("editor.previewZoom.hint")}
          </button>
        </div>
      </div>
      {/* Quiet frame only — do not overlay the cheque canvas. */}
      <div className="rounded-md border border-[#e7e4de] bg-white p-4 sm:p-6 lg:p-8">
        <div className="cheque-face-host w-full">
          <ScaledChequePreview data={cheque} color={chequeColor} />
        </div>
      </div>
    </div>
  );

  const optionsPanel = (
    <form
      id={CHEQUE_EDITOR_FORM_ID}
      method="post"
      action="about:blank"
      autoComplete="on"
      onSubmit={handleEditorSubmit}
      className="flex flex-col gap-5"
    >
      <ChequeEditorBar
        data={cheque}
        onChange={onFieldChange}
        onClear={handleClear}
      />
      <ChequeColorPicker value={chequeColor} onChange={setChequeColor} />
      <ChequeActionBar />
      <p className="text-center text-xs leading-relaxed text-[#8a8074]">
        {t("editor.autofillNote")}
      </p>
    </form>
  );

  if (variant === "split") {
    return (
      <>
        <form
          id={CHEQUE_EDITOR_FORM_ID}
          method="post"
          action="about:blank"
          autoComplete="on"
          onSubmit={handleEditorSubmit}
          className="w-full"
        >
          <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_22.5rem] xl:items-start xl:gap-10 2xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:gap-12">
            <div className="flex min-w-0 flex-col gap-5">
              {previewPanel}
              <ChequeColorPicker
                value={chequeColor}
                onChange={setChequeColor}
              />
              <ChequeActionBar />
            </div>

            <aside className="min-w-0 xl:sticky xl:top-24 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:pr-1">
              <div className="flex flex-col gap-4">
                <ChequeEditorBar
                  data={cheque}
                  onChange={onFieldChange}
                  onClear={handleClear}
                  layout="split"
                />
                <p className="text-center text-xs leading-relaxed text-[#8a8074] xl:text-left">
                  {t("editor.autofillNote")}
                </p>
              </div>
            </aside>
          </div>
        </form>

        <ChequeSaveModal
          open={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          savedAt={lastSavedAt}
          saveFailed={saveFailed}
        />
        <ChequePreviewZoomModal
          open={previewZoomOpen}
          onClose={() => setPreviewZoomOpen(false)}
          data={cheque}
          color={chequeColor}
        />
      </>
    );
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-5">
      {previewPanel}
      {optionsPanel}
      <ChequeSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        savedAt={lastSavedAt}
        saveFailed={saveFailed}
      />
      <ChequePreviewZoomModal
        open={previewZoomOpen}
        onClose={() => setPreviewZoomOpen(false)}
        data={cheque}
        color={chequeColor}
      />
    </div>
  );
}

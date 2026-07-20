"use client";

import { useEffect, useRef, useState } from "react";
import type { ChequeData } from "@/lib/cheque/cpa-format";
import {
  DEFAULT_CHEQUE_COLOR,
  getChequeColorTheme,
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
  const theme = getChequeColorTheme(chequeColor);

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

  const previewPanel = (
    <div
      className={`relative w-full rounded-xl border bg-gradient-to-br p-1.5 shadow-inner sm:p-2 ${theme.frameBorder} ${theme.frameBg}`}
    >
      <button
        type="button"
        onClick={handleSaveDraft}
        aria-label={t("editor.save.ariaLabel")}
        title={t("editor.save.title")}
        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-[#ff6633]/40 hover:bg-white hover:text-[#ff6633] sm:right-3 sm:top-3 sm:h-10 sm:w-10"
      >
        <FloppyDiskIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setPreviewZoomOpen(true)}
        className="group flex w-full flex-col gap-2 rounded-lg text-left xl:pointer-events-none"
        aria-label={t("editor.previewZoom.open")}
      >
        <div className="w-full overflow-hidden rounded-md">
          <ScaledChequePreview data={cheque} color={chequeColor} />
        </div>
        <span className="flex justify-center xl:hidden">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition group-active:scale-[0.98]">
            <ZoomIn className="h-3.5 w-3.5 text-[#ff6633]" aria-hidden />
            {t("editor.previewZoom.hint")}
          </span>
        </span>
      </button>
    </div>
  );

  const optionsPanel = (
    <form
      id={CHEQUE_EDITOR_FORM_ID}
      method="post"
      action="about:blank"
      autoComplete="on"
      onSubmit={handleEditorSubmit}
      className="flex flex-col gap-3"
    >
      <ChequeEditorBar
        data={cheque}
        onChange={onFieldChange}
        onClear={handleClear}
      />
      <ChequeColorPicker value={chequeColor} onChange={setChequeColor} />
      <ChequeActionBar />
      <p className="text-center text-[10px] leading-snug text-slate-400">
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
          <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[3fr_2fr] xl:items-start xl:gap-8 2xl:gap-10">
            <div className="flex min-w-0 flex-col gap-4">
              {previewPanel}
              <ChequeColorPicker
                value={chequeColor}
                onChange={setChequeColor}
              />
              <ChequeActionBar />
            </div>

            <aside className="min-w-0 xl:sticky xl:top-28 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
              <div className="flex flex-col gap-4">
                <ChequeEditorBar
                  data={cheque}
                  onChange={onFieldChange}
                  onClear={handleClear}
                  layout="split"
                />
                <p className="text-center text-[10px] leading-snug text-slate-400">
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
    <div className="flex w-full flex-col items-stretch gap-3">
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

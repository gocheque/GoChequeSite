"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useLocale } from "@/components/providers/locale-provider";
import {
  accountMicrSlotsForEditor,
  createEmptyAccountMicrSlots,
  digitsFromAccountMicrSlots,
  MICR_ACCOUNT_CLOSE_SLOT,
  MICR_ACCOUNT_DATA_SLOTS,
  micrAccountCloseSymbol,
  serializeAccountMicrSlots,
  type AccountMicrSlotState,
} from "@/lib/cheque/account-micr-slots";
import { MICR_ACCOUNT_PALETTE_CHARS } from "@/lib/cheque/micr-grid";

type DragPayload =
  | { source: "palette"; char: string }
  | { source: "slot"; slot: number; char: string };

const DRAG_MIME = "application/x-gocheque-account-micr";

function readDragPayload(dataTransfer: DataTransfer): DragPayload | null {
  const raw = dataTransfer.getData(DRAG_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
}

function writeDragPayload(dataTransfer: DataTransfer, payload: DragPayload): void {
  dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
  dataTransfer.effectAllowed = "move";
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return coarse;
}

type AccountNumberEditorModalProps = {
  open: boolean;
  account: string;
  accountMicrSlots?: Record<string, string>;
  onClose: () => void;
  onApply: (
    accountDigits: string,
    accountMicrSlots: Record<string, string> | undefined,
  ) => void;
};

export function AccountNumberEditorModal({
  open,
  account,
  accountMicrSlots,
  onClose,
  onApply,
}: AccountNumberEditorModalProps) {
  const { t } = useLocale();
  const isTouchMode = useCoarsePointer();
  const [slots, setSlots] = useState<AccountMicrSlotState>(() =>
    accountMicrSlotsForEditor(account, accountMicrSlots),
  );
  const [draggingSlot, setDraggingSlot] = useState<number | null>(null);
  const [selectedPaletteChar, setSelectedPaletteChar] = useState<string | null>(
    null,
  );
  const [pickedSlot, setPickedSlot] = useState<number | null>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSlots(accountMicrSlotsForEditor(account, accountMicrSlots));
      setDraggingSlot(null);
      setSelectedPaletteChar(null);
      setPickedSlot(null);
    }
  }, [open, account, accountMicrSlots]);

  useEffect(() => {
    if (!open || !isTouchMode) return;

    const el = gridScrollRef.current;
    if (!el) return;

    const alignGridToStart = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = maxScroll > 0 ? maxScroll : 0;
    };

    const frame = requestAnimationFrame(alignGridToStart);
    const timer = window.setTimeout(alignGridToStart, 64);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [open, isTouchMode]);

  const placeInSlot = useCallback(
    (
      targetSlot: number,
      char: string,
      payload: DragPayload,
      current: AccountMicrSlotState,
    ): AccountMicrSlotState => {
      const next = { ...current };
      const displaced = next[targetSlot];

      if (payload.source === "slot") {
        if (payload.slot === targetSlot) return current;
        next[payload.slot] = displaced;
      }

      next[targetSlot] = char;
      return next;
    },
    [],
  );

  function clearTapSelection() {
    setSelectedPaletteChar(null);
    setPickedSlot(null);
  }

  function handleSlotDrop(targetSlot: number, event: React.DragEvent) {
    event.preventDefault();
    const payload = readDragPayload(event.dataTransfer);
    if (!payload) return;

    setSlots((current) => placeInSlot(targetSlot, payload.char, payload, current));
    clearTapSelection();
  }

  function handlePaletteTap(char: string) {
    if (selectedPaletteChar === char) {
      setSelectedPaletteChar(null);
      return;
    }
    setSelectedPaletteChar(char);
    setPickedSlot(null);
  }

  function handleSlotTap(slot: number) {
    if (!isTouchMode) return;

    if (selectedPaletteChar) {
      setSlots((current) =>
        placeInSlot(
          slot,
          selectedPaletteChar,
          { source: "palette", char: selectedPaletteChar },
          current,
        ),
      );
      setSelectedPaletteChar(null);
      return;
    }

    if (pickedSlot !== null) {
      if (pickedSlot === slot) {
        setPickedSlot(null);
        return;
      }

      const char = slots[pickedSlot];
      if (!char) {
        setPickedSlot(null);
        return;
      }

      setSlots((current) =>
        placeInSlot(slot, char, { source: "slot", slot: pickedSlot, char }, current),
      );
      setPickedSlot(null);
      return;
    }

    if (slots[slot]) {
      setPickedSlot(slot);
    }
  }

  function handleClearSlot(slot: number) {
    setSlots((current) => {
      const next = { ...current };
      next[slot] = null;
      return next;
    });
    if (pickedSlot === slot) {
      setPickedSlot(null);
    }
  }

  function handleApply() {
    onApply(digitsFromAccountMicrSlots(slots), serializeAccountMicrSlots(slots));
  }

  function handleReset() {
    setSlots(createEmptyAccountMicrSlots());
    clearTapSelection();
  }

  const tapStatusMessage = selectedPaletteChar
    ? t("editor.account.tapStatusPalette", { char: selectedPaletteChar })
    : pickedSlot !== null
      ? t("editor.account.tapStatusSlot", { slot: String(pickedSlot) })
      : null;

  if (!open) return null;

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
        aria-labelledby="account-micr-editor-title"
        className="relative flex max-h-[min(92vh,52rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl"
      >
        <ModalCloseButton onClick={onClose} />

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ff6633]">
            <LayoutGrid className="h-6 w-6" aria-hidden />
          </div>

          <h2
            id="account-micr-editor-title"
            className="mt-4 text-center text-xl font-bold text-slate-900"
          >
            {t("editor.account.modalTitle")}
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
            {isTouchMode
              ? t("editor.account.modalHintTouch")
              : t("editor.account.modalHint")}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {t("editor.account.gridLabel")}
            </p>

            <div
              ref={gridScrollRef}
              className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
            >
              <div className="flex min-w-max items-end justify-end gap-1 sm:justify-center sm:gap-1.5">
                {MICR_ACCOUNT_DATA_SLOTS.map((slot) => {
                  const value = slots[slot];
                  const isDragging = draggingSlot === slot;
                  const isPicked = pickedSlot === slot;
                  const isTapTarget =
                    isTouchMode &&
                    (selectedPaletteChar !== null || pickedSlot !== null);

                  return (
                    <div key={slot} className="flex flex-col items-center gap-1">
                      <div
                        onClick={
                          isTouchMode ? () => handleSlotTap(slot) : undefined
                        }
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(event) => handleSlotDrop(slot, event)}
                        className={`group relative flex h-11 w-9 items-center justify-center rounded-lg border-2 border-dashed sm:h-12 sm:w-10 ${
                          value
                            ? "border-orange-200 bg-white"
                            : "border-slate-300 bg-white/60"
                        } ${isDragging ? "opacity-40" : ""} ${
                          isPicked
                            ? "border-[#ff6633] ring-2 ring-[#ff6633]/35"
                            : ""
                        } ${
                          isTapTarget && !value
                            ? "border-[#ff6633]/50 bg-orange-50/40"
                            : ""
                        } ${isTouchMode ? "cursor-pointer" : ""}`}
                      >
                        {value ? (
                          <>
                            <button
                              type="button"
                              draggable={!isTouchMode}
                              onClick={
                                isTouchMode
                                  ? (event) => {
                                      event.stopPropagation();
                                      handleSlotTap(slot);
                                    }
                                  : undefined
                              }
                              onDragStart={(event) => {
                                setDraggingSlot(slot);
                                writeDragPayload(event.dataTransfer, {
                                  source: "slot",
                                  slot,
                                  char: value,
                                });
                              }}
                              onDragEnd={() => setDraggingSlot(null)}
                              className={`account-micr-glyph flex h-full w-full items-center justify-center rounded-md text-lg sm:text-xl ${
                                isTouchMode
                                  ? "cursor-pointer"
                                  : "cursor-grab active:cursor-grabbing"
                              }`}
                              aria-label={t("editor.account.slotChar", {
                                slot: String(slot),
                                char: value,
                              })}
                            >
                              {value}
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleClearSlot(slot);
                              }}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-bold leading-none text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label={t("editor.account.removeSlot", {
                                char: value,
                              })}
                            >
                              −
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-300" aria-hidden>
                            ·
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-medium tabular-nums text-slate-400">
                        {slot}
                      </span>
                    </div>
                  );
                })}

                <div className="flex flex-col items-center gap-1">
                  <div
                    className="account-micr-slot-drop flex h-11 w-9 items-center justify-center rounded-lg border-2 border-[#ff6633]/40 bg-orange-50 sm:h-12 sm:w-10"
                    title={t("editor.account.closeSlotLabel")}
                  >
                    <span className="account-micr-glyph text-lg sm:text-xl">
                      {micrAccountCloseSymbol()}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold tabular-nums text-[#ff6633]">
                    {MICR_ACCOUNT_CLOSE_SLOT}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] text-slate-500">
                {t("editor.account.readingHint")}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {isTouchMode
                ? t("editor.account.paletteLabelTouch")
                : t("editor.account.paletteLabel")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {MICR_ACCOUNT_PALETTE_CHARS.map((char) => {
                const isSelected = selectedPaletteChar === char;

                return (
                  <button
                    key={char}
                    type="button"
                    draggable={!isTouchMode}
                    onClick={
                      isTouchMode ? () => handlePaletteTap(char) : undefined
                    }
                    onDragStart={(event) => {
                      writeDragPayload(event.dataTransfer, {
                        source: "palette",
                        char,
                      });
                    }}
                    className={`account-micr-glyph flex h-10 w-9 items-center justify-center rounded-lg border bg-white text-lg shadow-sm transition sm:h-11 sm:w-10 ${
                      isSelected
                        ? "border-[#ff6633] bg-orange-50 ring-2 ring-[#ff6633]/35"
                        : "border-slate-200 hover:border-[#ff6633]/40 hover:bg-orange-50"
                    } ${
                      isTouchMode
                        ? "cursor-pointer"
                        : "cursor-grab active:cursor-grabbing"
                    }`}
                    aria-label={t("editor.account.paletteChar", { char })}
                    aria-pressed={isTouchMode ? isSelected : undefined}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
            {isTouchMode && tapStatusMessage ? (
              <p className="mt-3 text-center text-xs font-medium text-[#ff6633]">
                {tapStatusMessage}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("editor.account.reset")}
            </button>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-slate-50/80 p-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t("editor.account.cancel")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 rounded-xl bg-[#ff6633] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e05526]"
          >
            {t("editor.account.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}

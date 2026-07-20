"use client";

import { useEffect, useRef, useState } from "react";
import { CpaChequePreview } from "@/components/cheque/cpa-cheque-preview";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { useLocale } from "@/components/providers/locale-provider";
import { CPA_CHEQUE, type ChequeData } from "@/lib/cheque/cpa-format";
import {
  DEFAULT_CHEQUE_COLOR,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";

const ZOOM_PADDING_PX = 20;
const ZOOM_SCALE_BOOST = 1.45;

function getZoomScale(viewportWidth: number): number {
  const available = Math.max(0, viewportWidth - ZOOM_PADDING_PX * 2);
  const fitScale = available / CPA_CHEQUE.widthPx;
  return Math.min(1, fitScale * ZOOM_SCALE_BOOST);
}

function centerScroll(el: HTMLDivElement) {
  const maxX = el.scrollWidth - el.clientWidth;
  const maxY = el.scrollHeight - el.clientHeight;
  if (maxX > 0) el.scrollLeft = maxX / 2;
  if (maxY > 0) el.scrollTop = maxY / 2;
}

type ChequePreviewZoomModalProps = {
  open: boolean;
  onClose: () => void;
  data: ChequeData;
  color?: ChequeColorId;
};

export function ChequePreviewZoomModal({
  open,
  onClose,
  data,
  color = DEFAULT_CHEQUE_COLOR,
}: ChequePreviewZoomModalProps) {
  const { t } = useLocale();
  const [scale, setScale] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const updateScale = () => setScale(getZoomScale(window.innerWidth));
    updateScale();
    window.addEventListener("resize", updateScale);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;

    const frame = requestAnimationFrame(() => centerScroll(el));
    return () => cancelAnimationFrame(frame);
  }, [open, scale]);

  if (!open) return null;

  const scaledWidth = CPA_CHEQUE.widthPx * scale;
  const scaledHeight = CPA_CHEQUE.heightPx * scale;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col xl:hidden">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheque-preview-zoom-title"
        className="relative z-10 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
          <div className="min-w-0">
            <h2
              id="cheque-preview-zoom-title"
              className="text-base font-semibold text-white"
            >
              {t("editor.previewZoom.title")}
            </h2>
            <p className="mt-0.5 text-xs text-white/70">
              {t("editor.previewZoom.scrollHint")}
            </p>
          </div>
          <ModalCloseButton
            onClick={onClose}
            className="relative shrink-0 border-white/20 bg-white/10 text-white hover:bg-white/20"
          />
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-auto overscroll-contain"
        >
          <div className="mx-auto flex min-h-full w-max items-center justify-center p-5">
            <div className="shrink-0 rounded-lg bg-white p-2 shadow-2xl">
              <div style={{ width: scaledWidth, height: scaledHeight }}>
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: CPA_CHEQUE.widthPx,
                    height: CPA_CHEQUE.heightPx,
                  }}
                >
                  <CpaChequePreview data={data} color={color} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

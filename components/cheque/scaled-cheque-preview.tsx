"use client";

import { useEffect, useRef, useState } from "react";
import { CpaChequePreview } from "@/components/cheque/cpa-cheque-preview";
import { CpaChequeBackPreview } from "@/components/cheque/cpa-cheque-back-preview";
import { CPA_CHEQUE, type ChequeData } from "@/lib/cheque/cpa-format";
import {
  DEFAULT_CHEQUE_COLOR,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";

type ScaledChequePreviewProps = {
  data: ChequeData;
  color?: ChequeColorId;
};

export function ScaledChequePreview({
  data,
  color = DEFAULT_CHEQUE_COLOR,
}: ScaledChequePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const available = el.clientWidth;
      setScale(Math.min(1, Math.max(0.1, available / CPA_CHEQUE.widthPx)));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scaledWidth = CPA_CHEQUE.widthPx * scale;
  const scaledHeight = CPA_CHEQUE.heightPx * scale;

  return (
    <div
      ref={containerRef}
      className="w-full self-stretch"
      data-cheque-print-host
    >
      <div
        className="mx-auto"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
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
      <div hidden aria-hidden>
        <CpaChequeBackPreview color={color} />
      </div>
    </div>
  );
}

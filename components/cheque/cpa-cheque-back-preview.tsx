"use client";

import { CPA_CHEQUE, CPA_LAYOUT } from "@/lib/cheque/cpa-format";

/**
 * Verso CPA 006 — §5.4.5 (Figure H)
 * Bord d'attaque = droite, bord d'alignement = bas.
 */
export function CpaChequeBackPreview() {
  return (
    <div
      data-cheque-print-back
      className="relative bg-white text-black"
      style={{
        width: "8.5in",
        maxWidth: "8.5in",
        height: CPA_CHEQUE.heightPx,
      }}
    >
      {/* 1) Timbre de caisse — §5.4.5 (1) */}
      <div
        className="absolute flex items-start justify-start border border-slate-300/60 p-1"
        style={{
          top: CPA_LAYOUT.tellerStampTopPx,
          left: CPA_LAYOUT.tellerStampLeftPx,
          width: CPA_LAYOUT.tellerStampMinWidthPx,
          height: CPA_LAYOUT.tellerStampMinHeightPx,
        }}
      >
        <span className="text-[6pt] leading-tight text-slate-400">
          Timbre de caisse
        </span>
      </div>

      {/* 2) Zone d'endossement — §5.4.5 (2) : une ligne de signature */}
      <div
        className="absolute flex flex-col justify-end"
        style={{
          top: CPA_LAYOUT.tellerStampTopPx,
          left: CPA_LAYOUT.endorsementLeftPx,
          right: CPA_LAYOUT.endorsementRightPx,
          bottom: CPA_LAYOUT.endorsementBottomPx,
        }}
      >
        <div
          className="mb-2 border-b border-slate-700"
          style={{ minHeight: CPA_LAYOUT.endorsementLineHeightPx }}
        />
        <p className="text-[8pt] font-semibold leading-tight text-black">
          Endossement – Signature ou timbre
        </p>
      </div>

      {/* 3) Indicateur de vérification — §5.4.5 (3), min. 10 pt */}
      <p
        className="absolute text-[10pt] font-bold tracking-wide text-black"
        style={{
          left: CPA_LAYOUT.versoLabelLeftPx,
          bottom: CPA_LAYOUT.versoLabelBottomPx,
        }}
      >
        VERSO / BACK
      </p>
    </div>
  );
}

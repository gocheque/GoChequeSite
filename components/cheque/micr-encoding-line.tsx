import { type ChequeData } from "@/lib/cheque/cpa-format";
import {
  buildMicrLineLayout,
  micrGridSlotLeftIn,
  micrInToCss,
} from "@/lib/cheque/micr-layout";

type MicrEncodingLineProps = {
  data: ChequeData;
};

/** Ligne MICR — grille 82 positions (E-13B, 0,125″ / position, de droite à gauche). */
export function MicrEncodingLine({ data }: MicrEncodingLineProps) {
  const layout = buildMicrLineLayout(undefined, {
    chqNum: data.chqNum,
    transit: data.transit,
    inst: data.inst,
    account: data.account,
    accountMicrSlots: data.accountMicrSlots,
  });

  const fieldBase = {
    bottom: micrInToCss(layout.baselineFromBandBottomIn),
    fontSize: `${layout.fontSizePt}pt`,
    letterSpacing: "0",
  } as const;

  return (
    <>
      {layout.cells.map((cell) => (
        <span
          key={`micr-slot-${cell.slotFromRight}`}
          className="cheque-micr-field cheque-micr-field--grid"
          style={{
            ...fieldBase,
            left: micrInToCss(
              micrGridSlotLeftIn(cell.slotFromRight, layout.checkArea.widthIn),
            ),
          }}
        >
          {cell.char}
        </span>
      ))}
    </>
  );
}

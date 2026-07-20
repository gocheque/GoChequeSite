/**
 * MICR CPA 006 — grille 82 positions + ancrage document chèque (8,5″ × 3,75″).
 */

import {
  buildMicrGridCells,
  CPA_MICR_CHAR_PITCH_IN,
  MICR_GRID_82,
  MICR_GRID_BOUNDARIES_FROM_RIGHT_IN,
  micrGridSlotLeftIn,
  type MicrGridCell,
  type MicrGridChequeInput,
} from "@/lib/cheque/micr-grid";

export {
  buildMicrGridCells,
  CPA_MICR_CHAR_PITCH_IN,
  MICR_GRID_82,
  MICR_GRID_BOUNDARIES_FROM_RIGHT_IN,
  micrGridSlotLeftIn,
  formatMicrLineFromGrid,
  type MicrGridCell,
  type MicrGridChequeInput,
} from "@/lib/cheque/micr-grid";

export const CPA_MICR_CHAR_PITCH_MM = 3.175;

export const CPA_MICR_BOUNDARIES_FROM_RIGHT_IN = MICR_GRID_BOUNDARIES_FROM_RIGHT_IN;

export const CPA_MICR_TRANSIT_BRANCH_CHAR_COUNT = 5;
export const CPA_MICR_TRANSIT_INST_CHAR_COUNT = 3;

export const CPA_MICR_TRANSIT_ZONE_WIDTH_IN =
  (MICR_GRID_82.transitClose - MICR_GRID_82.transitOpen + 1) *
  CPA_MICR_CHAR_PITCH_IN;

export const CPA_MICR_ON_US_ZONE_WIDTH_IN =
  (MICR_GRID_82.accountEnd - MICR_GRID_82.accountClose + 1) *
  CPA_MICR_CHAR_PITCH_IN;

/** Baseline 0,25″ du bas ; police 12 pt ; bande 0,625″. */
export const CPA_CHEQUE_DOCUMENT = {
  widthIn: 8.5,
  heightIn: 3.75,
  micrBandIn: 0.625,
  micrBaselineIn: 0.25,
  micrFontSizeIn: 12 / 72,
  micrLeftInsetIn: 0.125,
  dpi: 96,
} as const;

export const LETTER_PRINT_SHEET = {
  widthIn: 8.5,
  heightIn: 11,
} as const;

export type ChequeCheckArea = {
  pageXIn: number;
  pageYIn: number;
  widthIn: number;
  heightIn: number;
};

export const DEFAULT_CHEQUE_CHECK_AREA: ChequeCheckArea = {
  pageXIn: 0,
  pageYIn: 0,
  widthIn: CPA_CHEQUE_DOCUMENT.widthIn,
  heightIn: CPA_CHEQUE_DOCUMENT.heightIn,
};

export type MicrFieldLeftIn = {
  transitBranch: number;
  transitInst: number;
  account: number;
};

export function micrDocumentLeftFromRightIn(
  distFromRightIn: number,
  documentWidthIn: number = CPA_CHEQUE_DOCUMENT.widthIn,
): number {
  return documentWidthIn - distFromRightIn;
}

export function getMicrFieldLeftIn(
  documentWidthIn: number = CPA_CHEQUE_DOCUMENT.widthIn,
): MicrFieldLeftIn {
  return {
    transitBranch: micrGridSlotLeftIn(MICR_GRID_82.transitOpen, documentWidthIn),
    transitInst: micrGridSlotLeftIn(MICR_GRID_82.institutionStart, documentWidthIn),
    account: micrGridSlotLeftIn(MICR_GRID_82.accountStart, documentWidthIn),
  };
}

export const CPA_MICR_LETTER_SPACING_IN = 0;
export const CPA_MICR_TRANSIT_BRANCH_LETTER_SPACING_IN = 0;
export const CPA_MICR_TRANSIT_INST_LETTER_SPACING_IN = 0;

export function micrTextSlotWidthIn(charCount: number): number {
  if (charCount <= 0) return 0;
  return charCount * CPA_MICR_CHAR_PITCH_IN;
}

export type MicrLineLayout = {
  checkArea: ChequeCheckArea;
  bandHeightIn: number;
  baselineFromBandBottomIn: number;
  fontSizeIn: number;
  fontSizePt: number;
  cells: MicrGridCell[];
  fields: MicrFieldLeftIn;
  letterSpacingIn: number;
};

export function buildMicrLineLayout(
  checkArea: ChequeCheckArea = DEFAULT_CHEQUE_CHECK_AREA,
  gridData?: MicrGridChequeInput,
): MicrLineLayout {
  const fields = getMicrFieldLeftIn(checkArea.widthIn);
  const cells = gridData
    ? buildMicrGridCells(gridData, checkArea.widthIn)
    : [];

  return {
    checkArea,
    bandHeightIn: CPA_CHEQUE_DOCUMENT.micrBandIn,
    baselineFromBandBottomIn: CPA_CHEQUE_DOCUMENT.micrBaselineIn,
    fontSizeIn: CPA_CHEQUE_DOCUMENT.micrFontSizeIn,
    fontSizePt: 12,
    cells,
    fields,
    letterSpacingIn: CPA_MICR_LETTER_SPACING_IN,
  };
}

export function micrInToCss(inches: number): string {
  return `${inches}in`;
}

export function micrFieldLeftPx(leftIn: number): number {
  return Math.round(leftIn * CPA_CHEQUE_DOCUMENT.dpi);
}

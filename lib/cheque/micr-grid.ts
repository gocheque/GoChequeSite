/**
 * Grille MICR E-13B — 82 positions (0,125″ / position), numérotées du bord DROIT.
 * Sur document 8,5″ : 68 positions actives (1–68), 69–82 hors document.
 */

/** Pas E-13B — 0,125″ par position. */
export const CPA_MICR_CHAR_PITCH_IN = 0.125;

const DEFAULT_DOCUMENT_WIDTH_IN = 8.5;

/** Symboles GnuMICR E-13B */
export const MICR_ON_US = "C";
export const MICR_TRANSIT = "A";
export const MICR_DASH = "D";

export const MICR_ACCOUNT_PALETTE_CHARS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  MICR_DASH,
] as const;

export type MicrGridChequeInput = {
  chqNum: string;
  transit: string;
  inst: string;
  account: string;
  /** Placement personnalisé des cases compte 17–28 (clé = numéro de position). */
  accountMicrSlots?: Record<string, string>;
};

/** Grille de référence (82 positions — de droite à gauche). */
export const MICR_GRID_82 = {
  amountStart: 1,
  amountEnd: 12,
  /** Zone réservée — transit imprimé par la banque (laisser vide). */
  bankTransitReservedStart: 13,
  bankTransitReservedEnd: 15,
  accountClose: 16,
  accountStart: 17,
  accountEnd: 28,
  accountTransitBufferStart: 29,
  accountTransitBufferEnd: 32,
  transitClose: 33,
  institutionStart: 34,
  institutionEnd: 36,
  transitDash: 37,
  branchStart: 38,
  branchEnd: 42,
  transitOpen: 43,
  transitSerialBufferStart: 44,
  transitSerialBufferEnd: 46,
  serialClose: 47,
  serialStart: 48,
  serialEnd: 51,
  serialOpen: 52,
  residualStart: 53,
  referenceSlots: 82,
} as const;

/** Ancrage mécanique — position 16 (⑆ compte ; 13–15 réservées banque). */
export const MICR_GRID_FIRST_PRINTED_SLOT_FROM_RIGHT = MICR_GRID_82.accountClose;
export const MICR_GRID_FIRST_PRINTED_FROM_RIGHT_IN =
  MICR_GRID_FIRST_PRINTED_SLOT_FROM_RIGHT * CPA_MICR_CHAR_PITCH_IN;

export type MicrGridCell = {
  slotFromRight: number;
  char: string;
};

function padField(value: string, length: number): string {
  return value.replace(/\D/g, "").padStart(length, "0").slice(-length);
}

function formatSerialDigits(chqNum: string): string {
  return padField(chqNum, 4);
}

function sanitizeAccount(value: string): string {
  return value.replace(/\D/g, "");
}

/** Compte encodé pour positions 17–28 (tirets FI génériques). */
export function encodeAccountForGrid(account: string): string {
  const digits = sanitizeAccount(account);
  if (!digits) return "";

  let encoded = "";
  for (let i = 0; i < digits.length; i += 1) {
    encoded += digits[i];
    const position = i + 1;
    if (position === 3 && digits.length > 4) {
      encoded += MICR_DASH;
    }
    if (position === 6 && digits.length > 6) {
      encoded += MICR_DASH;
    }
  }
  return encoded;
}

export function micrGridSlotCount(documentWidthIn: number): number {
  return Math.floor(documentWidthIn / CPA_MICR_CHAR_PITCH_IN);
}

/** Bord gauche d'une position N (1 = la plus à droite). */
export function micrGridSlotLeftIn(
  slotFromRight: number,
  documentWidthIn: number = DEFAULT_DOCUMENT_WIDTH_IN,
): number {
  return documentWidthIn - slotFromRight * CPA_MICR_CHAR_PITCH_IN;
}

/**
 * Place du texte lisible gauche → droite sur le document.
 * slotRight = indice bas (proche du bord droit), slotLeft = indice haut (proche du bord gauche).
 */
function placeDigitsLtr(
  slots: Map<number, string>,
  slotRight: number,
  slotLeft: number,
  text: string,
): void {
  const capacity = slotLeft - slotRight + 1;
  const trimmed = text.slice(-capacity);
  for (let i = 0; i < trimmed.length; i += 1) {
    slots.set(slotLeft - i, trimmed[i]!);
  }
}

/** Compte : aligné à droite, LSD en 17 (près du ⑆ de fermeture en 16). */
function placeAccountDigits(
  slots: Map<number, string>,
  slotRight: number,
  slotLeft: number,
  text: string,
): void {
  const capacity = slotLeft - slotRight + 1;
  const trimmed = text.slice(-capacity);
  for (let i = 0; i < trimmed.length; i += 1) {
    slots.set(slotRight + (trimmed.length - 1 - i), trimmed[i]!);
  }
}

/**
 * Série C…C — 4 chiffres contigus en 51–48, collés au ⑆ d'ouverture (52) et au ⑆ de fermeture (47).
 * Ex. 104 → 0104 → 52=⑆, 51=0, 50=1, 49=0, 48=4, 47=⑆.
 */
function placeSerialField(
  slots: Map<number, string>,
  openSlot: number,
  closeSlot: number,
  digitSlotRight: number,
  digitSlotLeft: number,
  text: string,
): void {
  const capacity = digitSlotLeft - digitSlotRight + 1;
  const padded = padField(text, capacity);

  slots.set(openSlot, MICR_ON_US);
  slots.set(closeSlot, MICR_ON_US);

  for (let i = 0; i < padded.length; i += 1) {
    slots.set(openSlot - 1 - i, padded[i]!);
  }
}

/**
 * Remplit la grille MICR selon le plan 82 positions (de droite à gauche).
 * Zones 1–12, 13–15 (banque), 29–32, 44–46 et résiduelles : vides.
 */
export function buildMicrGridCells(
  data: MicrGridChequeInput,
  documentWidthIn: number = DEFAULT_DOCUMENT_WIDTH_IN,
): MicrGridCell[] {
  const slots = new Map<number, string>();
  const g = MICR_GRID_82;
  const maxSlot = micrGridSlotCount(documentWidthIn);

  const accountEncoded = encodeAccountForGrid(data.account);
  const customAccountSlots = data.accountMicrSlots;
  const hasCustomAccountLayout =
    customAccountSlots !== undefined &&
    Object.keys(customAccountSlots).length > 0;

  if (hasCustomAccountLayout) {
    slots.set(g.accountClose, MICR_ON_US);
    for (const [slotKey, char] of Object.entries(customAccountSlots)) {
      const slot = Number(slotKey);
      if (
        slot >= g.accountStart &&
        slot <= g.accountEnd &&
        char.length > 0
      ) {
        slots.set(slot, char);
      }
    }
  } else if (accountEncoded) {
    slots.set(g.accountClose, MICR_ON_US);
    placeAccountDigits(slots, g.accountStart, g.accountEnd, accountEncoded);
  }

  slots.set(g.transitOpen, MICR_TRANSIT);
  placeDigitsLtr(slots, g.branchStart, g.branchEnd, padField(data.transit, 5));
  slots.set(g.transitDash, MICR_DASH);
  placeDigitsLtr(slots, g.institutionStart, g.institutionEnd, padField(data.inst, 3));
  slots.set(g.transitClose, MICR_TRANSIT);

  const serial = formatSerialDigits(data.chqNum);
  placeSerialField(
    slots,
    g.serialOpen,
    g.serialClose,
    g.serialStart,
    g.serialEnd,
    serial,
  );

  const cells: MicrGridCell[] = [];
  for (const [slotFromRight, char] of slots) {
    if (slotFromRight >= 1 && slotFromRight <= maxSlot) {
      cells.push({ slotFromRight, char });
    }
  }

  return cells.sort((a, b) => b.slotFromRight - a.slotFromRight);
}

/** Ligne MICR compacte (gauche → droite sur le document). */
export function formatMicrLineFromGrid(
  data: MicrGridChequeInput,
  documentWidthIn: number = DEFAULT_DOCUMENT_WIDTH_IN,
): string {
  return buildMicrGridCells(data, documentWidthIn)
    .map((cell) => cell.char)
    .join("");
}

/** Limites horizontales dérivées de la grille (depuis le bord droit). */
export const MICR_GRID_BOUNDARIES_FROM_RIGHT_IN = {
  amountInner: MICR_GRID_82.amountEnd * CPA_MICR_CHAR_PITCH_IN,
  accountClose: MICR_GRID_82.accountClose * CPA_MICR_CHAR_PITCH_IN,
  accountTransit: MICR_GRID_82.accountEnd * CPA_MICR_CHAR_PITCH_IN,
  transitClose: MICR_GRID_82.transitClose * CPA_MICR_CHAR_PITCH_IN,
  transitOpen: MICR_GRID_82.transitOpen * CPA_MICR_CHAR_PITCH_IN,
  serialOpen: MICR_GRID_82.serialOpen * CPA_MICR_CHAR_PITCH_IN,
} as const;

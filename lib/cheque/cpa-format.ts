/** Helpers CPA Standard 006 — formatage affichage (aperçu visuel) */

export type ChequeData = {
  emitterName: string;
  emitterAddr: string;
  bankName: string;
  bankAddr: string;
  chqNum: string;
  date: string;
  payee: string;
  amount: number;
  memo: string;
  transit: string;
  inst: string;
  account: string;
  /** Grille MICR personnalisée du compte (cases 17–28), si éditée via le modal. */
  accountMicrSlots?: Record<string, string>;
};

import {
  buildMicrLineLayout,
  CPA_CHEQUE_DOCUMENT,
  CPA_MICR_BOUNDARIES_FROM_RIGHT_IN,
  CPA_MICR_CHAR_PITCH_IN,
  CPA_MICR_CHAR_PITCH_MM,
  CPA_MICR_ON_US_ZONE_WIDTH_IN,
  CPA_MICR_TRANSIT_BRANCH_CHAR_COUNT,
  CPA_MICR_TRANSIT_BRANCH_LETTER_SPACING_IN,
  CPA_MICR_TRANSIT_INST_CHAR_COUNT,
  CPA_MICR_TRANSIT_INST_LETTER_SPACING_IN,
  CPA_MICR_TRANSIT_ZONE_WIDTH_IN,
  DEFAULT_CHEQUE_CHECK_AREA,
  formatMicrLineFromGrid,
  getMicrFieldLeftIn,
  MICR_GRID_82,
  micrFieldLeftPx,
  type ChequeCheckArea,
  type MicrLineLayout,
} from "@/lib/cheque/micr-layout";

export {
  buildMicrLineLayout,
  CPA_CHEQUE_DOCUMENT,
  CPA_MICR_BOUNDARIES_FROM_RIGHT_IN,
  CPA_MICR_CHAR_PITCH_IN,
  CPA_MICR_CHAR_PITCH_MM,
  CPA_MICR_TRANSIT_BRANCH_CHAR_COUNT,
  CPA_MICR_TRANSIT_INST_CHAR_COUNT,
  CPA_MICR_TRANSIT_ZONE_WIDTH_IN,
  DEFAULT_CHEQUE_CHECK_AREA,
  formatMicrLineFromGrid,
  getMicrFieldLeftIn,
  MICR_GRID_82,
  type ChequeCheckArea,
  type MicrLineLayout,
};

/** Dimensions CPA 006 — max 21,59 × 9,53 cm (8½" × 3¾") @ 96 dpi */
export const CPA_CHEQUE = {
  widthPx: Math.round(CPA_CHEQUE_DOCUMENT.widthIn * CPA_CHEQUE_DOCUMENT.dpi),
  heightPx: Math.round(CPA_CHEQUE_DOCUMENT.heightIn * CPA_CHEQUE_DOCUMENT.dpi),
  micrBandPx: Math.round(CPA_CHEQUE_DOCUMENT.micrBandIn * CPA_CHEQUE_DOCUMENT.dpi),
  bodyPx: Math.round((CPA_CHEQUE_DOCUMENT.heightIn - CPA_CHEQUE_DOCUMENT.micrBandIn) * CPA_CHEQUE_DOCUMENT.dpi),
  dpi: CPA_CHEQUE_DOCUMENT.dpi,
} as const;

/** Positionnement bande MICR — CPA §4.2 / §4.3 / Annexe I (E-13B) */
export const CPA_MICR = {
  bandPx: CPA_CHEQUE.micrBandPx,
  baselinePx: Math.round(CPA_CHEQUE_DOCUMENT.micrBaselineIn * CPA_CHEQUE_DOCUMENT.dpi),
  charHeightPx: 24,
  fontSizePx: Math.round(CPA_CHEQUE_DOCUMENT.micrFontSizeIn * CPA_CHEQUE_DOCUMENT.dpi),
  leftInsetPx: Math.round(CPA_CHEQUE_DOCUMENT.micrLeftInsetIn * CPA_CHEQUE_DOCUMENT.dpi),
} as const;

const _micrLayout = buildMicrLineLayout();
const _micrFields = _micrLayout.fields;

export const CPA_CHEQUE_IN = {
  width: CPA_CHEQUE_DOCUMENT.widthIn,
  height: CPA_CHEQUE_DOCUMENT.heightIn,
  micrBand: CPA_CHEQUE_DOCUMENT.micrBandIn,
  micrBaseline: CPA_CHEQUE_DOCUMENT.micrBaselineIn,
  micrCharHeight: 0.25,
  micrFontRender: CPA_CHEQUE_DOCUMENT.micrFontSizeIn,
  micrFontPt: 12,
  micrLeftInset: CPA_CHEQUE_DOCUMENT.micrLeftInsetIn,
  micrTransitLeft: _micrFields.transitBranch,
  micrTransitBranchLeft: _micrFields.transitBranch,
  micrTransitInstLeft: _micrFields.transitInst,
  micrAccountLeft: _micrFields.account,
  micrAccountMaxWidth: _micrLayout.checkArea.widthIn
    ? CPA_MICR_ON_US_ZONE_WIDTH_IN
    : 0,
  micrLetterSpacing: _micrLayout.letterSpacingIn,
  micrTransitBranchWidth:
    CPA_MICR_TRANSIT_BRANCH_CHAR_COUNT * CPA_MICR_CHAR_PITCH_IN,
  micrTransitInstWidth:
    CPA_MICR_TRANSIT_INST_CHAR_COUNT * CPA_MICR_CHAR_PITCH_IN,
  micrTransitBranchLetterSpacing: CPA_MICR_TRANSIT_BRANCH_LETTER_SPACING_IN,
  micrTransitInstLetterSpacing: CPA_MICR_TRANSIT_INST_LETTER_SPACING_IN,
} as const;

/** Zones horizontales MICR @ 96 dpi — dérivées du layout CPA (document chèque). */
export const CPA_MICR_FIELDS = {
  transitLeftPx: micrFieldLeftPx(_micrLayout.fields.transitBranch),
  transitBranchLeftPx: micrFieldLeftPx(_micrLayout.fields.transitBranch),
  transitInstLeftPx: micrFieldLeftPx(_micrLayout.fields.transitInst),
  accountLeftPx: micrFieldLeftPx(_micrLayout.fields.account),
} as const;

/** Positions CPA 006 @ 96 dpi — Partie A §5.4.1 / §5.4.2 / §5.4.5 */
export const CPA_LAYOUT = {
  sideInsetPx: 24, // 0,25"
  bodyTopPaddingPx: 4,
  /** §5.4.2 — zone balayage montant chiffres : 2,15″ à 1,20″ du bord d'alignement (bas) */
  scanZoneTopPx: 154,
  scanZoneBottomPx: 245,
  emitterTopPx: 12,
  payeeRowTopPx: 118, // min. ~116 pour garder le rectangle montant dans la zone balayage
  legalAmountTopPx: 160,
  legalAmountLineHeightPx: 18,
  bodyFooterBottomPx: 8,
  bodyBottomReservePx: 48,
  footerLabelHeightPx: 14,
  footerLineRowHeightPx: 18,
  bankBlockHeightPx: 38,
  signatureMemoWidthPx: 300,
  signatureLineWidthPx: 272, // ~2,85" — libellé sur une ligne sans excès
  amountBoxWidthPx: 148,
  amountBoxHeightPx: 38,
  /** Montant chiffres dans le rectangle — min. 10 pt §5.3 ; légèrement au-dessus pour lisibilité */
  amountBoxFontSizePt: 12,
  /** Symbole $ après le rectangle — ~80 % de la hauteur de la case §5.4.2 */
  amountDollarSignSizePx: 26,
  dollarGapPx: 4,
  dateTopPx: 34,
  dateWidthPx: 200,
  chequeNumTopPx: 8,
  tellerStampTopPx: 12, // 1/8"
  tellerStampLeftPx: 12,
  tellerStampMinWidthPx: 155, // 4,1 cm
  tellerStampMinHeightPx: 132, // 3,5 cm
  endorsementLeftPx: 480, // 3,5" du bord d'attaque (droite)
  endorsementRightPx: 48, // 1/2" du bord droit
  endorsementBottomPx: 144, // 1,5" du bord d'alignement
  endorsementLineHeightPx: 18,
  versoLabelLeftPx: 480,
  versoLabelBottomPx: 96, // 1" du bord d'alignement
} as const;

/** Centre la banque verticalement entre le montant légal et la ligne mémo */
export function getBankTopPx(): number {
  const zoneTop = CPA_LAYOUT.legalAmountTopPx + CPA_LAYOUT.legalAmountLineHeightPx;
  const memoLineTop =
    CPA_CHEQUE.bodyPx -
    CPA_LAYOUT.bodyFooterBottomPx -
    CPA_LAYOUT.footerLabelHeightPx -
    CPA_LAYOUT.footerLineRowHeightPx;
  const zoneHeight = memoLineTop - zoneTop;
  return (
    zoneTop +
    Math.max(0, Math.round((zoneHeight - CPA_LAYOUT.bankBlockHeightPx) / 2))
  );
}

export function padField(value: string, length: number): string {
  return value.replace(/\D/g, "").padStart(length, "0").slice(-length);
}

/** Numéro de chèque — max 4 chiffres (affichage recto + ligne MICR, positions 51–48). */
export const CPA_CHEQUE_SERIAL_MAX_DIGITS = 4;

export function sanitizeChequeNumberInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, CPA_CHEQUE_SERIAL_MAX_DIGITS);
}

export function formatChequeNumber(value: string): string {
  return padField(value, CPA_CHEQUE_SERIAL_MAX_DIGITS);
}

/** Date ISO → 8 chiffres YYYYMMDD (norme CPA) */
export function formatCpaDateDigits(isoDate: string): string[] {
  const digits = isoDate.replace(/-/g, "");
  if (digits.length !== 8) return Array(8).fill("");
  return digits.split("");
}

export type CpaDateParts = {
  year: string[];
  month: string[];
  day: string[];
};

/** Date ISO → groupes année (4), mois (2), jour (2) pour les cases CPA. */
export function formatCpaDateParts(isoDate: string): CpaDateParts {
  const digits = formatCpaDateDigits(isoDate);
  return {
    year: digits.slice(0, 4),
    month: digits.slice(4, 6),
    day: digits.slice(6, 8),
  };
}

/** Symboles GnuMICR E-13B — A transit, B amount, C on-us, D dash */
const MICR_ON_US = "C";
const MICR_TRANSIT = "A";
const MICR_DASH = "D";

/** Compte MICR — chiffres significatifs uniquement (§4.4.2.2 ; tirets = fiche FI). */
export function sanitizeMicrAccount(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Champs MICR CPA 006 §4.4 — 3 zones distinctes (gauche → droite sur le chèque).
 */
export function formatMicrSerialField(data: ChequeData): string {
  const serial = formatChequeNumber(data.chqNum);
  return `${MICR_ON_US}${serial}${MICR_ON_US}`;
}

/** §4.4.3 — exactement 11 caractères encodés (⑆ + transit + ⑉ + inst + ⑆). */
export function formatMicrTransitBranchField(data: ChequeData): string {
  const transit = padField(data.transit, 5);
  return `${MICR_TRANSIT}${transit}${MICR_DASH}`;
}

export function formatMicrTransitInstitutionField(data: ChequeData): string {
  const inst = padField(data.inst, 3);
  return `${inst}${MICR_TRANSIT}`;
}

export function formatMicrTransitField(data: ChequeData): string {
  return `${formatMicrTransitBranchField(data)}${formatMicrTransitInstitutionField(data)}`;
}

export function formatMicrAccountOpeningSymbol(): string {
  return MICR_ON_US;
}

/** Corps encodé du compte depuis une grille personnalisée (cases 28 → 17). */
function encodedAccountFromMicrRecord(record: Record<string, string>): string {
  let encoded = "";
  for (let slot = 28; slot >= 17; slot -= 1) {
    const char = record[String(slot)];
    if (char) encoded += char;
  }
  return encoded;
}

export function formatMicrAccountDigitsBody(data: ChequeData): string {
  if (data.accountMicrSlots && Object.keys(data.accountMicrSlots).length > 0) {
    return encodedAccountFromMicrRecord(data.accountMicrSlots);
  }

  const account = sanitizeMicrAccount(data.account);
  if (!account) return "";

  let encoded = "";
  for (let i = 0; i < account.length; i += 1) {
    encoded += account[i];
    const position = i + 1;
    if (position === 3 && account.length > 4) {
      encoded += MICR_DASH;
    }
    if (position === 6 && account.length > 6) {
      encoded += MICR_DASH;
    }
  }

  return encoded;
}

/**
 * §4.4.2 / §4.4.2.2 — Numéro de compte (zone On-Us, dernière à droite).
 * On-Us d'ouverture obligatoire ; pas de symbole de fermeture pour le champ On-Us (§4.4.2).
 */
export function formatMicrAccountField(data: ChequeData): string {
  const digits = formatMicrAccountDigitsBody(data);
  if (!digits) return "";
  return `${formatMicrAccountOpeningSymbol()}${digits}`;
}

/** Concaténation compacte (debug / export texte) — grille 82 positions. */
export function formatMicrLine(data: ChequeData): string {
  return formatMicrLineFromGrid({
    chqNum: data.chqNum,
    transit: data.transit,
    inst: data.inst,
    account: data.account,
    accountMicrSlots: data.accountMicrSlots,
  });
}

/** Contenu du rectangle montant en chiffres — §5.4.2 (astérisques + montant ; le $ est à l'extérieur). */
export function formatConvenienceAmount(amount: number): string {
  const formatted = amount.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const digitCount = formatted.replace(/[^0-9]/g, "").length;
  return `${"*".repeat(Math.max(0, 5 - digitCount))}${formatted}`;
}

export function numeroEnLettres(montant: number): string {
  const unites = [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
  ];
  const dizaines = [
    "",
    "dix",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingt",
    "quatre-vingt-dix",
  ];
  const deOnzeADixNeuf = [
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ];

  const entier = Math.floor(montant);
  if (entier === 0) return "zéro";

  function convertirCentaine(n: number): string {
    let res = "";
    const h = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (h > 0) {
      res += (h === 1 ? "" : unites[h] + "-") + "cent";
      if (d === 0 && u === 0 && h > 1) res += "s";
      if (d > 0 || u > 0) res += " ";
    }
    if (d === 1 && u > 0) {
      res += deOnzeADixNeuf[u - 1];
    } else {
      if (d > 0) res += dizaines[d] + (u === 1 && d < 8 ? "-et-" : u > 0 ? "-" : "");
      if (u > 0) res += unites[u];
    }
    return res.trim();
  }

  const mille = Math.floor(entier / 1000);
  const reste = entier % 1000;
  let resultat = "";

  if (mille > 0) {
    resultat += (mille === 1 ? "" : convertirCentaine(mille) + " ") + "mille ";
  }
  if (reste > 0) {
    resultat += convertirCentaine(reste);
  }

  return resultat.trim();
}

function convertEnglishUnder1000(n: number): string {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) {
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit ? ` ${ones[unit]}` : "");
  }

  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let result = `${ones[hundreds]} hundred`;
  if (rest) result += ` ${convertEnglishUnder1000(rest)}`;
  return result;
}

export function amountInWordsEn(amount: number): string {
  const whole = Math.floor(amount);
  if (whole === 0) return "zero";

  const parts: string[] = [];
  const millions = Math.floor(whole / 1_000_000);
  const thousands = Math.floor((whole % 1_000_000) / 1000);
  const remainder = whole % 1000;

  if (millions > 0) {
    parts.push(`${convertEnglishUnder1000(millions)} million`);
  }
  if (thousands > 0) {
    parts.push(`${convertEnglishUnder1000(thousands)} thousand`);
  }
  if (remainder > 0) {
    parts.push(convertEnglishUnder1000(remainder));
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export type AmountWordsLocale = "fr" | "en";

export function amountInWords(
  amount: number,
  locale: AmountWordsLocale = "fr",
): string {
  return locale === "en" ? amountInWordsEn(amount) : numeroEnLettres(amount);
}

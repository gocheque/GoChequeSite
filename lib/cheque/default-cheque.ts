import type { Locale } from "@/lib/i18n/config";
import type { ChequeData } from "@/lib/cheque/cpa-format";

const DEFAULT_CHEQUE_FR: ChequeData = {
  emitterName: "LES ATELIERS BOREAL INC.",
  emitterAddr: "Québec, Québec\nG1R 4P5",
  bankName: "BANQUE NATIONALE DU CANADA",
  bankAddr: "600 Rue de la Gauchetière Ouest\nMontréal QC H3B 4L2",
  chqNum: "3847",
  date: "",
  payee: "RENOVATIONS ST-LAURENT INC.",
  amount: 1432.89,
  memo: "Services mars 2026 — #SL-4482",
  transit: "01561",
  inst: "006",
  account: "4829153",
};

const DEFAULT_CHEQUE_EN: ChequeData = {
  emitterName: "LAKEVIEW CONSULTING INC.",
  emitterAddr: "Vancouver, British Columbia\nV6B 4N8",
  bankName: "CANADIAN IMPERIAL BANK OF COMMERCE",
  bankAddr: "81 Bay Street, 16th Floor\nToronto ON M5J 0E7",
  chqNum: "7102",
  date: "",
  payee: "HARBOR LIGHT MEDIA LTD.",
  amount: 2891.55,
  memo: "Contract retainer — HL-2290",
  transit: "00312",
  inst: "010",
  account: "7592048",
};

export function getDefaultCheque(locale: Locale): ChequeData {
  return locale === "en" ? { ...DEFAULT_CHEQUE_EN } : { ...DEFAULT_CHEQUE_FR };
}

const EMPTY_CHEQUE: ChequeData = {
  emitterName: "",
  emitterAddr: "",
  bankName: "",
  bankAddr: "",
  chqNum: "",
  date: "",
  payee: "",
  amount: 0,
  memo: "",
  transit: "",
  inst: "",
  account: "",
};

export function getEmptyCheque(): ChequeData {
  return { ...EMPTY_CHEQUE };
}

/** Conservé pour les décorations MICR statiques de la page d'accueil. */
export const DEFAULT_CHEQUE: ChequeData = { ...DEFAULT_CHEQUE_FR };

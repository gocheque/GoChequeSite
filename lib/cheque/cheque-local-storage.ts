import {
  type ChequeData,
  sanitizeChequeNumberInput,
} from "@/lib/cheque/cpa-format";
import type { ChequeColorId } from "@/lib/cheque/cheque-colors";
import { safeJsonParse } from "@/lib/safe-json";

const STORAGE_KEY = "echeck.ca:cheque-draft";

export type ChequeDraft = {
  version: 1;
  cheque: ChequeData;
  color: ChequeColorId;
  savedAt: string;
};

const CHEQUE_COLOR_IDS: ChequeColorId[] = [
  "blue",
  "orange",
  "green",
  "grey",
  "yellow",
];

function isChequeColorId(value: unknown): value is ChequeColorId {
  return (
    typeof value === "string" &&
    CHEQUE_COLOR_IDS.includes(value as ChequeColorId)
  );
}

function isChequeData(value: unknown): value is ChequeData {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.emitterName === "string" &&
    typeof o.emitterAddr === "string" &&
    typeof o.bankName === "string" &&
    typeof o.bankAddr === "string" &&
    typeof o.chqNum === "string" &&
    typeof o.date === "string" &&
    typeof o.payee === "string" &&
    typeof o.amount === "number" &&
    typeof o.memo === "string" &&
    typeof o.transit === "string" &&
    typeof o.inst === "string" &&
    typeof o.account === "string" &&
    (o.accountMicrSlots === undefined ||
      (typeof o.accountMicrSlots === "object" &&
        o.accountMicrSlots !== null &&
        !Array.isArray(o.accountMicrSlots)))
  );
}

export function saveChequeDraft(
  cheque: ChequeData,
  color: ChequeColorId,
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const draft: ChequeDraft = {
      version: 1,
      cheque,
      color,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearChequeDraft(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadChequeDraft(): ChequeDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw?.trim()) return null;

    const parsed = safeJsonParse<unknown>(raw);
    if (!parsed || typeof parsed !== "object") {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if (
      record.version !== 1 ||
      !isChequeData(record.cheque) ||
      !isChequeColorId(record.color) ||
      typeof record.savedAt !== "string"
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      version: 1,
      cheque: {
        ...record.cheque,
        chqNum: sanitizeChequeNumberInput(record.cheque.chqNum),
      },
      color: record.color,
      savedAt: record.savedAt,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

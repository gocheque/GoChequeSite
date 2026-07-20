import {
  encodeAccountForGrid,
  MICR_DASH,
  MICR_GRID_82,
  MICR_ON_US,
} from "@/lib/cheque/micr-grid";
import { sanitizeMicrAccount } from "@/lib/cheque/cpa-format";

export const MICR_ACCOUNT_CLOSE_SLOT = MICR_GRID_82.accountClose;
export const MICR_ACCOUNT_DATA_SLOT_FIRST = MICR_GRID_82.accountStart;
export const MICR_ACCOUNT_DATA_SLOT_LAST = MICR_GRID_82.accountEnd;
export const MICR_BANK_TRANSIT_RESERVED_FIRST = MICR_GRID_82.bankTransitReservedStart;
export const MICR_BANK_TRANSIT_RESERVED_LAST = MICR_GRID_82.bankTransitReservedEnd;

/** Positions 17–28, ordre document gauche → droite (MSD → LSD). */
export const MICR_ACCOUNT_DATA_SLOTS = Array.from(
  { length: MICR_ACCOUNT_DATA_SLOT_LAST - MICR_ACCOUNT_DATA_SLOT_FIRST + 1 },
  (_, index) => MICR_ACCOUNT_DATA_SLOT_LAST - index,
) as number[];

/** Positions 15–13 (réservées banque), affichage spécimen de droite à gauche. */
export const MICR_BANK_TRANSIT_RESERVED_SLOTS = Array.from(
  { length: MICR_BANK_TRANSIT_RESERVED_LAST - MICR_BANK_TRANSIT_RESERVED_FIRST + 1 },
  (_, index) => MICR_BANK_TRANSIT_RESERVED_LAST - index,
) as number[];

export type AccountMicrSlotState = Record<number, string | null>;

/** Anciennes cases 14–25 → nouvelles 17–28. */
function migrateLegacyAccountMicrSlot(slot: number): number | null {
  if (slot >= MICR_ACCOUNT_DATA_SLOT_FIRST && slot <= MICR_ACCOUNT_DATA_SLOT_LAST) {
    return slot;
  }
  if (slot >= 14 && slot <= 25) {
    return slot + 3;
  }
  return null;
}

export function createEmptyAccountMicrSlots(): AccountMicrSlotState {
  const slots: AccountMicrSlotState = {};
  for (const slot of MICR_ACCOUNT_DATA_SLOTS) {
    slots[slot] = null;
  }
  return slots;
}

/** Initialise les cases 17–28 à partir des chiffres du compte (tirets auto). */
export function accountMicrSlotsFromDigits(account: string): AccountMicrSlotState {
  const slots = createEmptyAccountMicrSlots();
  const encoded = encodeAccountForGrid(account);
  if (!encoded) return slots;

  const capacity = MICR_ACCOUNT_DATA_SLOTS.length;
  const trimmed = encoded.slice(-capacity);
  for (let index = 0; index < trimmed.length; index += 1) {
    slots[MICR_ACCOUNT_DATA_SLOT_FIRST + (trimmed.length - 1 - index)] =
      trimmed[index]!;
  }

  return slots;
}

/** Extrait les chiffres du compte depuis les cases 28 → 17 (lecture MICR). */
export function digitsFromAccountMicrSlots(slots: AccountMicrSlotState): string {
  let digits = "";
  for (const slot of MICR_ACCOUNT_DATA_SLOTS) {
    const value = slots[slot];
    if (!value || value === MICR_DASH) continue;
    if (/\d/.test(value)) {
      digits += value;
    }
  }
  return sanitizeMicrAccount(digits);
}

export function isMicrAccountDataSlot(slot: number): boolean {
  return slot >= MICR_ACCOUNT_DATA_SLOT_FIRST && slot <= MICR_ACCOUNT_DATA_SLOT_LAST;
}

export function micrAccountCloseSymbol(): string {
  return MICR_ON_US;
}

export function serializeAccountMicrSlots(
  slots: AccountMicrSlotState,
): Record<string, string> | undefined {
  const record: Record<string, string> = {};
  for (const slot of MICR_ACCOUNT_DATA_SLOTS) {
    const value = slots[slot];
    if (value) {
      record[String(slot)] = value;
    }
  }
  return Object.keys(record).length > 0 ? record : undefined;
}

export function accountMicrSlotsFromRecord(
  record?: Record<string, string> | null,
): AccountMicrSlotState {
  const slots = createEmptyAccountMicrSlots();
  if (!record) return slots;

  for (const [slotKey, char] of Object.entries(record)) {
    const migratedSlot = migrateLegacyAccountMicrSlot(Number(slotKey));
    if (migratedSlot !== null && isMicrAccountDataSlot(migratedSlot) && char) {
      slots[migratedSlot] = char;
    }
  }

  return slots;
}

/** Ouvre le modal : grille sauvegardée ou encodage auto depuis les chiffres. */
export function accountMicrSlotsForEditor(
  account: string,
  saved?: Record<string, string> | null,
): AccountMicrSlotState {
  if (saved && Object.keys(saved).length > 0) {
    return accountMicrSlotsFromRecord(saved);
  }
  return accountMicrSlotsFromDigits(account);
}

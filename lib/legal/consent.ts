import { safeJsonParse } from "@/lib/safe-json";

export const LEGAL_CONSENT_STORAGE_KEY = "gocheque_legal_consent";
export const LEGAL_CONSENT_VERSION = "2026-07-06-privacy";

type LegalConsentRecord = {
  version: string;
  acceptedAt: string;
};

export function hasLegalConsent(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem(LEGAL_CONSENT_STORAGE_KEY);
    if (!raw?.trim()) return false;

    const parsed = safeJsonParse<LegalConsentRecord>(raw);
    if (!parsed) {
      localStorage.removeItem(LEGAL_CONSENT_STORAGE_KEY);
      return false;
    }

    return parsed.version === LEGAL_CONSENT_VERSION;
  } catch {
    localStorage.removeItem(LEGAL_CONSENT_STORAGE_KEY);
    return false;
  }
}

export function saveLegalConsent(): void {
  const record: LegalConsentRecord = {
    version: LEGAL_CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
  };

  localStorage.setItem(LEGAL_CONSENT_STORAGE_KEY, JSON.stringify(record));
}

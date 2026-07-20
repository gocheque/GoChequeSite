import type { Locale } from "@/lib/i18n/config";

type PrintMobileListener = (locale: Locale) => void;

let listener: PrintMobileListener | null = null;

export function setPrintMobileListener(next: PrintMobileListener | null) {
  listener = next;
}

export function openMobilePrint(locale: Locale) {
  listener?.(locale);
}

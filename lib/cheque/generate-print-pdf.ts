import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import type { Locale } from "@/lib/i18n/config";
import {
  buildOffscreenPrintFrame,
} from "@/lib/cheque/print-cheque";

const LETTER_WIDTH_IN = 8.5;
const LETTER_HEIGHT_IN = 11;
const LETTER_WIDTH_PX = Math.round(LETTER_WIDTH_IN * 96);
const LETTER_HEIGHT_PX = Math.round(LETTER_HEIGHT_IN * 96);

/**
 * Génère un PDF lettre US (2 pages) identique au document d'impression desktop.
 * Client-side — html2canvas-pro gère oklab/oklch (Tailwind v4).
 */
export async function generateChequePrintPdf(locale?: Locale): Promise<Blob> {
  const frame = buildOffscreenPrintFrame(locale);
  if (!frame) {
    throw new Error("CHEQUE_SOURCES_MISSING");
  }

  try {
    await frame.ready;
    const pages = Array.from(
      frame.doc.querySelectorAll<HTMLElement>(".cheque-print-page"),
    );
    if (pages.length === 0) {
      throw new Error("CHEQUE_PAGES_MISSING");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
      compress: true,
    });

    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i]!;
      page.style.width = `${LETTER_WIDTH_PX}px`;
      page.style.height = `${LETTER_HEIGHT_PX}px`;
      page.style.minHeight = `${LETTER_HEIGHT_PX}px`;
      page.style.overflow = "hidden";

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: LETTER_WIDTH_PX,
        height: LETTER_HEIGHT_PX,
        windowWidth: LETTER_WIDTH_PX,
        windowHeight: LETTER_HEIGHT_PX,
        logging: false,
        onclone: (_clonedDoc, element) => {
          element.style.width = `${LETTER_WIDTH_PX}px`;
          element.style.height = `${LETTER_HEIGHT_PX}px`;
          element.style.background = "#ffffff";
        },
      });

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      if (i > 0) pdf.addPage("letter", "portrait");
      pdf.addImage(
        dataUrl,
        "JPEG",
        0,
        0,
        LETTER_WIDTH_IN,
        LETTER_HEIGHT_IN,
        undefined,
        "FAST",
      );
    }

    return pdf.output("blob");
  } finally {
    frame.cleanup();
  }
}

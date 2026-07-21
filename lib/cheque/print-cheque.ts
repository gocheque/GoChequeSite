import {
  DEFAULT_CHEQUE_COLOR,
  getChequeColorTheme,
  getChequePrintBackgroundImage,
  type ChequeColorId,
  type ChequeColorTheme,
} from "@/lib/cheque/cheque-colors";
import {
  DEFAULT_CHEQUE_CHECK_AREA,
  LETTER_PRINT_SHEET,
} from "@/lib/cheque/micr-layout";
import { CPA_CHEQUE_IN, CPA_MICR } from "@/lib/cheque/cpa-format";
import { promptBrowserSaveChequeData } from "@/lib/cheque/cheque-form-autofill";
import { isCoarsePointerDevice } from "@/lib/cheque/is-coarse-pointer";
import { openMobilePrint } from "@/lib/cheque/print-mobile-bridge";
import { waitForPrintAssets } from "@/lib/cheque/print-assets";
import { htmlLang, getLocaleFromPathname, type Locale } from "@/lib/i18n/config";

const IFRAME_CLASS = "cheque-print-iframe";
const PRINT_MOUNT_ID = "gocheque-print-mount";
const PRINT_STYLE_ID = "gocheque-print-style";

const MICR_BAND = `${CPA_CHEQUE_IN.micrBand}in`;
const MICR_BASELINE = `${CPA_CHEQUE_IN.micrBaseline}in`;
const MICR_FONT_PT = `${CPA_CHEQUE_IN.micrFontPt}pt`;
const CHECK_AREA = DEFAULT_CHEQUE_CHECK_AREA;
const SHEET_HEIGHT = `${LETTER_PRINT_SHEET.heightIn}in`;
const CHECK_AREA_HEIGHT = `${CHECK_AREA.heightIn}in`;
const PRINT_GUIDES_INSET = "0.3in";
/** Écart sous le bas du chèque — évite la superposition avec le bord imprimé. */
const CUT_GUIDE_OFFSET = "0.5mm";
/**
 * Décalage vertical du verso (guide + chèque) pour le registres recto-verso.
 * Calibré empiriquement (6 mm trop bas de 4 mm → 2 mm).
 */
const PRINT_BACK_SHIFT = "2mm";

const SCISSORS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="8.12" y1="8.12" x2="21" y2="21"/><line x1="21" y1="3" x2="8.12" y2="15.88"/></svg>`;

const ARROW_UP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`;

const PRINT_COPY = {
  fr: {
    cutLabel: "Couper ici",
    brandMark: "Chèque généré avec GoCheque.ca",
    settingsTitle: "Paramètres d'impression",
    settings: [
      "Format du papier : <strong>Lettre US</strong> (8,5 × 11 po)",
      "Orientation : <strong>Portrait</strong>",
      "Marges : <strong>Aucune</strong>",
      "Échelle : <strong>100 %</strong> (taille réelle — ne pas cocher « Ajuster à la page »)",
      "Pages : <strong>2</strong> (recto, puis verso)",
      "Recto-verso : <strong>Retourner sur le bord long</strong> (ou « Bord long » / « Flip on long edge »)",
    ],
    manualDuplexTitle: "Si votre imprimante n'a pas le recto-verso",
    manualDuplex: [
      "Étape 1 — Imprimez uniquement la <strong>page 1</strong> (recto).",
      "Étape 2 — Retournez la feuille sur le <strong>bord long</strong>, puis réinsérez-la dans le même sens.",
      "Étape 3 — Imprimez uniquement la <strong>page 2</strong> (verso).",
    ],
    finishingTitle: "Finition",
    finishing: ["Coupez le long de la ligne pointillée sous le chèque."],
  },
  en: {
    cutLabel: "Cut here",
    brandMark: "Cheque generated with GoCheque.ca",
    settingsTitle: "Print settings",
    settings: [
      "Paper size: <strong>US Letter</strong> (8.5 × 11 in)",
      "Orientation: <strong>Portrait</strong>",
      "Margins: <strong>None</strong>",
      'Scale: <strong>100%</strong> (actual size — do not select "Fit to page")',
      "Pages: <strong>2</strong> (front, then back)",
      'Duplex: <strong>Flip on long edge</strong> (or "Long edge" / "Flip on long edge")',
    ],
    manualDuplexTitle: "If your printer does not support duplex",
    manualDuplex: [
      "Step 1 — Print <strong>page 1</strong> only (front).",
      "Step 2 — Flip the sheet on the <strong>long edge</strong>, then reinsert it the same way.",
      "Step 3 — Print <strong>page 2</strong> only (back).",
    ],
    finishingTitle: "Finishing",
    finishing: ["Cut along the dashed line below the cheque."],
  },
} as const satisfies Record<Locale, Record<string, string | readonly string[]>>;

function resolvePrintLocale(locale?: Locale): Locale {
  if (locale) return locale;
  const lang = document.documentElement.lang.toLowerCase();
  if (lang.startsWith("en")) return "en";
  return getLocaleFromPathname(window.location.pathname) ?? "fr";
}

function renderGuideList(items: readonly string[]): string {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function buildPrintStyles(theme: ChequeColorTheme) {
  const borderColor = theme.printBorderColor;

  return `
  @font-face {
    font-family: "GnuMICR";
    src: url("${typeof window !== 'undefined' ? window.location.origin : ''}/fonts/GnuMICR.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  @page {
    size: letter portrait;
    margin: 0;
  }

  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
    background: white !important;
  }

  .cheque-print-document {
    box-sizing: border-box;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .cheque-print-page {
    box-sizing: border-box;
    position: relative;
    width: 100% !important;
    max-width: 100% !important;
    min-height: ${SHEET_HEIGHT};
    margin: 0 !important;
    padding: 0 !important;
    page-break-after: always;
    break-after: page;
  }

  .cheque-print-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .cheque-print-sheet {
    box-sizing: border-box;
    position: relative;
    width: 100% !important;
    max-width: 100% !important;
    min-height: ${SHEET_HEIGHT};
    margin: 0 !important;
    padding: 0 !important;
  }

  .cheque-print-page:first-child .cheque-print-sheet {
    min-height: ${SHEET_HEIGHT};
  }

  .cheque-print-check-area {
    box-sizing: border-box;
    position: absolute;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: ${CHECK_AREA_HEIGHT};
    margin: 0 !important;
    padding: 0 !important;
  }

  .cheque-print-sheet--back .cheque-print-check-area {
    top: ${PRINT_BACK_SHIFT} !important;
  }

  .cheque-print-cheque {
    box-sizing: border-box;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }

  [data-cheque-print],
  [data-cheque-print-back] {
    display: flex !important;
    flex-direction: column !important;
    box-sizing: border-box !important;
    position: relative !important;
    flex: none !important;
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    transform: none !important;
    border: 1px solid ${borderColor} !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  [data-cheque-print] {
    background-color: ${theme.backgroundColor} !important;
    background-image: ${getChequePrintBackgroundImage(theme)} !important;
    background-clip: border-box !important;
  }

  [data-cheque-print-back] {
    background: white !important;
    /* Garde le contour gauche/droite/bas ; retire seulement la ligne du haut. */
    border-top: none !important;
  }

  [data-cheque-print] > div:first-child,
  [data-cheque-print] .cheque-body-frame {
    box-sizing: border-box !important;
    flex: 1 1 0 !important;
    min-height: 0 !important;
    width: 100% !important;
    height: auto !important;
    overflow: hidden !important;
    background: none !important;
  }

  [data-cheque-print] > div:last-child {
    display: block !important;
    box-sizing: border-box !important;
    flex: 0 0 ${MICR_BAND} !important;
    width: 100% !important;
    height: ${MICR_BAND} !important;
    min-height: ${MICR_BAND} !important;
    max-height: ${MICR_BAND} !important;
    overflow: hidden !important;
    position: relative !important;
    background: white !important;
  }

  [data-cheque-print] .cheque-micr-field {
    font-family: "GnuMICR", monospace !important;
    font-size: ${MICR_FONT_PT} !important;
    line-height: 1 !important;
    height: auto !important;
    letter-spacing: 0 !important;
    white-space: nowrap !important;
    color: #000 !important;
    position: absolute !important;
    bottom: ${MICR_BASELINE} !important;
    margin: 0 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  [data-cheque-print] img {
    display: inline-block !important;
    max-width: none !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  [data-cheque-void] {
    display: none !important;
  }

  .cheque-cut-guide {
    box-sizing: border-box;
    position: absolute;
    left: 0 !important;
    top: calc(${CHECK_AREA_HEIGHT} + ${CUT_GUIDE_OFFSET});
    width: 100% !important;
    padding: 0;
    color: ${borderColor};
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .cheque-print-sheet--back .cheque-cut-guide {
    top: calc(${CHECK_AREA_HEIGHT} + ${PRINT_BACK_SHIFT} + ${CUT_GUIDE_OFFSET}) !important;
  }

  .cheque-cut-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1in;
    margin: 0;
    color: ${borderColor};
  }

  .cheque-cut-arrow,
  .cheque-cut-icon {
    display: flex;
    flex-shrink: 0;
    width: 0.2in;
    height: 0.2in;
  }

  .cheque-cut-arrow svg,
  .cheque-cut-icon svg {
    width: 100%;
    height: 100%;
  }

  .cheque-cut-label {
    flex-shrink: 0;
    font-size: 7pt;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${borderColor};
  }

  .cheque-print-brand {
    margin: 0.14in 0 0;
    text-align: center;
    font-size: 6.5pt;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #64748b;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .cheque-print-guides {
    position: absolute;
    left: 0 !important;
    top: calc(${CHECK_AREA_HEIGHT} + ${CUT_GUIDE_OFFSET} + 0.58in);
    box-sizing: border-box;
    width: 100% !important;
    margin-top: 0;
    padding: 0 ${PRINT_GUIDES_INSET};
    border-top: none;
    color: #1e293b;
    font-size: 8.5pt;
    line-height: 1.55;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .cheque-print-guides-title {
    margin: 0 0 0.12in;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #0f172a;
  }

  .cheque-print-guides ul {
    margin: 0 0 0.28in;
    padding: 0 0 0 1.1em;
  }

  .cheque-print-guides li {
    margin-bottom: 0.1in;
  }

  .cheque-print-guides li:last-child {
    margin-bottom: 0;
  }

  .cheque-print-guides strong {
    font-weight: 700;
    color: #0f172a;
  }
`;
}

function copyStyles(targetDoc: Document, theme: ChequeColorTheme) {
  document
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((node) => {
      targetDoc.head.appendChild(node.cloneNode(true));
    });

  const printStyle = targetDoc.createElement("style");
  printStyle.textContent = buildPrintStyles(theme);
  targetDoc.head.appendChild(printStyle);
}

/** Clone sans largeurs px inline — évite un filet blanc (px vs in à l'impression). */
function cloneChequeForPrint(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.width = "";
  clone.style.maxWidth = "";
  clone.style.height = "";
  clone.style.minHeight = "";
  clone.style.maxHeight = "";
  clone.querySelectorAll("[data-cheque-void]").forEach((node) => node.remove());

  // Évite le fond noir WebKit (transparent → noir à l'impression).
  if (clone.hasAttribute("data-cheque-print")) {
    const colorId =
      (clone.getAttribute("data-cheque-color") as ChequeColorId | null) ??
      DEFAULT_CHEQUE_COLOR;
    const theme = getChequeColorTheme(colorId);
    clone.style.backgroundColor = theme.backgroundColor;
    clone.style.backgroundImage = getChequePrintBackgroundImage(theme);
  }

  return clone;
}

function buildChequeFrame(source: HTMLElement): HTMLElement {
  const checkArea = document.createElement("div");
  checkArea.className = "cheque-print-check-area";

  const chequeWrap = document.createElement("div");
  chequeWrap.className = "cheque-print-cheque";
  chequeWrap.appendChild(cloneChequeForPrint(source));

  checkArea.appendChild(chequeWrap);
  return checkArea;
}

function buildPrintGuides(locale: Locale): HTMLElement {
  const copy = PRINT_COPY[locale];
  const guides = document.createElement("div");
  guides.className = "cheque-print-guides";
  guides.innerHTML = `
    <p class="cheque-print-guides-title">${copy.settingsTitle}</p>
    <ul>${renderGuideList(copy.settings)}</ul>
    <p class="cheque-print-guides-title">${copy.manualDuplexTitle}</p>
    <ul>${renderGuideList(copy.manualDuplex)}</ul>
    <p class="cheque-print-guides-title">${copy.finishingTitle}</p>
    <ul>${renderGuideList(copy.finishing)}</ul>
  `;
  return guides;
}

function buildCutGuide(locale: Locale, opts?: { back?: boolean }): HTMLElement {
  const copy = PRINT_COPY[locale];
  const cutGuide = document.createElement("div");
  cutGuide.className = "cheque-cut-guide";
  cutGuide.setAttribute("aria-hidden", "true");
  // Inline : garantit le décalage verso même si une autre feuille de style écrase la classe.
  const shift = opts?.back ? ` + ${PRINT_BACK_SHIFT}` : "";
  cutGuide.style.top = `calc(${CHECK_AREA_HEIGHT} + ${CUT_GUIDE_OFFSET}${shift})`;
  cutGuide.style.left = "0";
  cutGuide.style.width = "100%";
  cutGuide.innerHTML = `
    <div class="cheque-cut-hint">
      <span class="cheque-cut-arrow">${ARROW_UP_SVG}</span>
      <span class="cheque-cut-icon">${SCISSORS_SVG}</span>
      <span class="cheque-cut-label">${copy.cutLabel}</span>
    </div>
    ${
      opts?.back
        ? ""
        : `<p class="cheque-print-brand">${copy.brandMark}</p>`
    }
  `;
  return cutGuide;
}

function buildFrontPage(
  frontSource: HTMLElement,
  locale: Locale,
): HTMLElement {
  const page = document.createElement("div");
  page.className = "cheque-print-page";

  const sheet = document.createElement("div");
  sheet.className = "cheque-print-sheet";

  sheet.appendChild(buildChequeFrame(frontSource));
  sheet.appendChild(buildCutGuide(locale));
  sheet.appendChild(buildPrintGuides(locale));

  page.appendChild(sheet);
  return page;
}

function buildBackPage(
  backSource: HTMLElement,
  locale: Locale,
): HTMLElement {
  const page = document.createElement("div");
  page.className = "cheque-print-page";

  const sheet = document.createElement("div");
  sheet.className = "cheque-print-sheet cheque-print-sheet--back";

  sheet.appendChild(buildChequeFrame(backSource));
  sheet.appendChild(buildCutGuide(locale, { back: true }));

  page.appendChild(sheet);
  return page;
}

function buildPrintDocument(
  frontSource: HTMLElement,
  backSource: HTMLElement | null,
  locale: Locale,
): HTMLElement {
  const documentRoot = document.createElement("div");
  documentRoot.className = "cheque-print-document";

  documentRoot.appendChild(buildFrontPage(frontSource, locale));

  if (backSource) {
    documentRoot.appendChild(buildBackPage(backSource, locale));
  }

  return documentRoot;
}

function waitForAssets(doc: Document, win: Window): Promise<void> {
  const linkLoads = Array.from(
    doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  ).map(
    (link) =>
      new Promise<void>((resolve) => {
        if (link.sheet) {
          resolve();
          return;
        }
        link.addEventListener("load", () => resolve(), { once: true });
        link.addEventListener("error", () => resolve(), { once: true });
      }),
  );

  const fontLoad = doc.fonts
    ? doc.fonts.load(`${CPA_MICR.fontSizePx}px "GnuMICR"`).catch(() => undefined)
    : Promise.resolve();

  return Promise.race([
    Promise.allSettled([
      waitForPrintAssets(doc.body, win),
      ...linkLoads,
      fontLoad,
    ]).then(() => undefined),
    new Promise<void>((resolve) => {
      win.setTimeout(resolve, 2000);
    }),
  ]);
}

function getChequePrintSources() {
  const frontSource = document.querySelector<HTMLElement>("[data-cheque-print]");
  const backSource = document.querySelector<HTMLElement>(
    "[data-cheque-print-back]",
  );

  if (!frontSource) return null;

  const colorId =
    (frontSource.getAttribute("data-cheque-color") as ChequeColorId | null) ??
    DEFAULT_CHEQUE_COLOR;

  return {
    frontSource,
    backSource,
    theme: getChequeColorTheme(colorId),
  };
}

/** Monte le document d'impression dans la page (pour mobile / window.print). */
export function mountPrintJob(locale?: Locale): (() => void) | null {
  const printLocale = resolvePrintLocale(locale);
  const sources = getChequePrintSources();
  if (!sources) return null;

  document.getElementById(PRINT_MOUNT_ID)?.remove();
  document.getElementById(PRINT_STYLE_ID)?.remove();

  const mount = document.createElement("div");
  mount.id = PRINT_MOUNT_ID;
  mount.className = "cheque-print-frame";
  mount.appendChild(
    buildPrintDocument(
      sources.frontSource,
      sources.backSource,
      printLocale,
    ),
  );

  const style = document.createElement("style");
  style.id = PRINT_STYLE_ID;
  /*
   * Mobile / iOS : ne pas monter hors écran. Safari imprime souvent ce qui est
   * visible à l'écran et ignore @media print → on montre le chèque tout de suite
   * sous .gocheque-printing, puis window.print().
   */
  style.textContent = `${buildPrintStyles(sources.theme)}
html.gocheque-printing,
html.gocheque-printing body {
  background: #fff !important;
  margin: 0 !important;
  padding: 0 !important;
}

html.gocheque-printing body > *:not(#${PRINT_MOUNT_ID}) {
  visibility: hidden !important;
  pointer-events: none !important;
}

html.gocheque-printing #${PRINT_MOUNT_ID},
html.gocheque-printing #${PRINT_MOUNT_ID} * {
  visibility: visible !important;
}

@media screen {
  html.gocheque-printing,
  html.gocheque-printing body {
    overflow: hidden !important;
    height: 100% !important;
  }

  html.gocheque-printing #${PRINT_MOUNT_ID} {
    display: block !important;
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: auto !important;
    -webkit-overflow-scrolling: touch;
    background: #fff !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    z-index: 2147483647 !important;
  }
}

@media print {
  html.gocheque-printing,
  html.gocheque-printing body {
    height: auto !important;
    overflow: visible !important;
  }

  html.gocheque-printing body > *:not(#${PRINT_MOUNT_ID}) {
    display: none !important;
  }

  html.gocheque-printing #${PRINT_MOUNT_ID} {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    z-index: 2147483647 !important;
  }
}`;

  document.documentElement.classList.add("gocheque-printing");
  document.body.classList.add("gocheque-printing");
  document.head.appendChild(style);
  document.body.appendChild(mount);

  return () => {
    document.documentElement.classList.remove("gocheque-printing");
    document.body.classList.remove("gocheque-printing");
    mount.remove();
    style.remove();
  };
}

export async function printChequeInPage(locale?: Locale): Promise<boolean> {
  const cleanup = mountPrintJob(locale);
  if (!cleanup) {
    console.error("[printChequeInPage] sources de chèque introuvables");
    return false;
  }

  const mount = document.getElementById(PRINT_MOUNT_ID);
  if (mount) {
    mount.scrollTop = 0;
    await waitForPrintAssets(mount, window);
    // Forcer un layout visible avant print (sinon iOS garde l'ancienne page).
    void mount.offsetHeight;
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

  return new Promise((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      window.removeEventListener("afterprint", onAfterPrint);
      printMedia?.removeEventListener("change", onPrintMediaChange);
      resolve(ok);
    };

    const onAfterPrint = () => finish(true);
    const printMedia =
      typeof window.matchMedia === "function"
        ? window.matchMedia("print")
        : null;
    const onPrintMediaChange = () => {
      if (printMedia && !printMedia.matches) finish(true);
    };

    window.addEventListener("afterprint", onAfterPrint);
    printMedia?.addEventListener("change", onPrintMediaChange);

    try {
      window.focus();
      window.print();
    } catch {
      finish(false);
      return;
    }

    // iOS n'émet pas toujours afterprint
    window.setTimeout(() => finish(true), 60_000);
  });
}

/**
 * Impression mobile fiable : onglet dédié ne contenant que le chèque.
 * iOS imprime souvent la page parente avec window.print() / iframe.print().
 * Le popup doit être ouvert de façon synchrone au clic (gesture utilisateur).
 */
export async function printChequeInPopup(
  locale: Locale | undefined,
  popup: Window,
): Promise<boolean> {
  const printLocale = resolvePrintLocale(locale);
  const sources = getChequePrintSources();
  if (!sources) {
    console.error("[printChequeInPopup] sources de chèque introuvables");
    try {
      popup.close();
    } catch {
      // ignore
    }
    return false;
  }

  const doc = popup.document;
  const origin = window.location.origin;

  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="${htmlLang(printLocale)}"><head>` +
      `<meta charset="utf-8"/>` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"/>` +
      `<meta name="color-scheme" content="light only"/>` +
      `<base href="${origin}/"/>` +
      `<title>GoCheque</title>` +
      `<style>` +
      `html,body{color-scheme:light only;background:#fff!important;color:#0f172a;margin:0!important;padding:0!important;width:100%!important}` +
      `#gocheque-popup-bar{position:sticky;top:0;z-index:10;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px 16px;background:#0f172a;color:#fff;font:600 14px/1.4 system-ui,sans-serif}` +
      `#gocheque-popup-bar button{appearance:none;border:0;border-radius:10px;padding:10px 14px;font:600 14px/1.2 system-ui,sans-serif;cursor:pointer}` +
      `#gocheque-popup-bar .primary{background:#ff6633;color:#fff}` +
      `#gocheque-popup-bar .ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.35)}` +
      /* iOS force des marges : on étire le document pour coller aux bords papier. */ +
      `@media print{` +
      `#gocheque-popup-bar{display:none!important}` +
      `@page{size:letter portrait;margin:0!important}` +
      `html,body{width:100%!important;margin:0!important;padding:0!important}` +
      `.cheque-print-document{width:calc(100% + 0.5in)!important;margin:-0.25in 0 0 -0.25in!important}` +
      `.cheque-print-page,.cheque-print-sheet,.cheque-print-check-area,.cheque-cut-guide,.cheque-print-guides{width:100%!important;left:0!important;margin:0!important;padding-left:0!important;padding-right:0!important}` +
      `.cheque-print-check-area{top:0!important}` +
      `.cheque-print-guides{padding-left:0.3in!important;padding-right:0.3in!important}` +
      `}` +
      `</style>` +
      `</head><body class="cheque-print-frame"></body></html>`,
  );
  doc.close();

  copyStyles(doc, sources.theme);
  doc.documentElement.lang = htmlLang(printLocale);

  const toolbar = doc.createElement("div");
  toolbar.id = "gocheque-popup-bar";
  toolbar.innerHTML =
    `<span>${printLocale === "fr" ? "Document d'impression GoCheque" : "GoCheque print document"}</span>` +
    `<button type="button" class="primary" data-print>${printLocale === "fr" ? "Imprimer / PDF" : "Print / PDF"}</button>` +
    `<button type="button" class="ghost" data-close>${printLocale === "fr" ? "Fermer" : "Close"}</button>`;

  const printRoot = doc.importNode(
    buildPrintDocument(
      sources.frontSource,
      sources.backSource,
      printLocale,
    ),
    true,
  );

  doc.body.replaceChildren(toolbar, printRoot);

  toolbar
    .querySelector("[data-print]")
    ?.addEventListener("click", () => {
      popup.focus();
      popup.print();
    });
  toolbar
    .querySelector("[data-close]")
    ?.addEventListener("click", () => {
      popup.close();
    });

  await waitForAssets(doc, popup).catch(() => undefined);
  await waitForPrintAssets(doc.body, popup);

  await new Promise<void>((resolve) => {
    popup.requestAnimationFrame(() => {
      popup.requestAnimationFrame(() => resolve());
    });
  });

  try {
    popup.focus();
    popup.print();
  } catch (err) {
    console.error("[printChequeInPopup] print() a échoué", err);
    // L'onglet reste ouvert : l'utilisateur peut retaper Imprimer.
  }

  return true;
}

export function printCheque(locale?: Locale) {
  promptBrowserSaveChequeData();

  const printLocale = resolvePrintLocale(locale);

  if (isCoarsePointerDevice()) {
    openMobilePrint(printLocale);
    return;
  }

  const sources = getChequePrintSources();
  if (!sources) {
    console.error("[printCheque] sources de chèque introuvables");
    return;
  }

  document.querySelector(`.${IFRAME_CLASS}`)?.remove();

  const iframe = document.createElement("iframe");
  iframe.className = IFRAME_CLASS;
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return;
  }

  const doc = win.document;
  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="${htmlLang(printLocale)}"><head></head><body class="cheque-print-frame"></body></html>`,
  );
  doc.close();

  copyStyles(doc, sources.theme);
  doc.documentElement.lang = htmlLang(printLocale);
  doc.body.className = `${document.body.className} cheque-print-frame`.trim();
  doc.body.replaceChildren(
    buildPrintDocument(
      sources.frontSource,
      sources.backSource,
      printLocale,
    ),
  );

  const cleanup = () => {
    iframe.remove();
    win.removeEventListener("afterprint", cleanup);
  };

  win.addEventListener("afterprint", cleanup);

  void waitForAssets(doc, win)
    .catch(() => undefined)
    .then(() => {
      requestAnimationFrame(() => {
        win.focus();
        win.print();
      });
    });
}

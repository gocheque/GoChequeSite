"use client";

import {
  CPA_CHEQUE,
  CPA_LAYOUT,
  amountInWords,
  formatConvenienceAmount,
  formatCpaDateParts,
  formatChequeNumber,
  getBankTopPx,
  type ChequeData,
} from "@/lib/cheque/cpa-format";
import { useLocale } from "@/components/providers/locale-provider";
import {
  DEFAULT_CHEQUE_COLOR,
  getChequeColorTheme,
  getChequePrintBorderColor,
  type ChequeColorId,
} from "@/lib/cheque/cheque-colors";
import { MicrEncodingLine } from "@/components/cheque/micr-encoding-line";

type CpaChequePreviewProps = {
  data: ChequeData;
  color?: ChequeColorId;
};

const DATE_LABEL_ROW_CLASS =
  "mt-0.5 flex h-[9px] w-[22px] items-center justify-center text-[7pt] font-semibold leading-none text-black";

function DateDigitField({ digit, label }: { digit: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[22px] w-[22px] items-center justify-center border border-slate-400 bg-white/90 font-mono text-[10pt] font-semibold text-black">
        {digit}
      </div>
      <span className={DATE_LABEL_ROW_CLASS}>{label}</span>
    </div>
  );
}

function DateDigitGroup({
  digits,
  labels,
}: {
  digits: string[];
  labels: string[];
}) {
  return (
    <div className="flex gap-px">
      {digits.map((digit, i) => (
        <DateDigitField key={i} digit={digit} label={labels[i]} />
      ))}
    </div>
  );
}

function DateDashField() {
  return (
    <div className="flex flex-col items-center">
      <span
        className="mx-px flex h-[22px] items-center px-0 font-mono text-[10pt] font-bold leading-none text-black"
        aria-hidden
      >
        -
      </span>
      <span className="mt-0.5 h-[9px]" aria-hidden />
    </div>
  );
}

function splitDateLabels(locale: "fr" | "en") {
  if (locale === "fr") {
    return { year: ["A", "A", "A", "A"], month: ["M", "M"], day: ["J", "J"] };
  }
  return { year: ["Y", "Y", "Y", "Y"], month: ["M", "M"], day: ["D", "D"] };
}

/**
 * Aperçu visuel CPA 006 (Part A §5.4.1 / §5.4.2)
 */
export function CpaChequePreview({
  data,
  color = DEFAULT_CHEQUE_COLOR,
}: CpaChequePreviewProps) {
  const { locale, t } = useLocale();
  const theme = getChequeColorTheme(color);
  const borderColor = getChequePrintBorderColor(color);
  const dateParts = formatCpaDateParts(data.date);
  const dateLabels = splitDateLabels(locale);
  const cents = Math.round((data.amount % 1) * 100)
    .toString()
    .padStart(2, "0");
  const montantLettres = amountInWords(data.amount, locale).toUpperCase();
  const chqNum = formatChequeNumber(data.chqNum);

  return (
    <div
      className="relative box-border flex flex-shrink-0 flex-col overflow-hidden"
      style={{
        width: CPA_CHEQUE.widthPx,
        maxWidth: CPA_CHEQUE.widthPx,
        height: CPA_CHEQUE.heightPx,
        boxSizing: "border-box",
      }}
    >
      <div
        className="relative box-border flex h-full w-full min-h-0 flex-1 flex-col overflow-hidden text-black"
        data-cheque-print
        data-cheque-color={color}
        style={{
          width: CPA_CHEQUE.widthPx,
          maxWidth: CPA_CHEQUE.widthPx,
          border: `1px solid ${borderColor}`,
          backgroundColor: theme.backgroundColor,
          backgroundImage: theme.backgroundImage,
        }}
      >
        {/* Filigrane anti-fraude — retiré à l'impression (clone + CSS print) */}
        <div
          data-cheque-void
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
        >
          <span
            className="select-none text-[4.25rem] font-black uppercase tracking-[0.2em] text-slate-900/[0.14]"
            style={{ transform: "rotate(-22deg)" }}
          >
            {t("editor.voidWatermark")}
          </span>
        </div>

        <div
          className="cheque-body-frame relative z-10 min-h-0 flex-1 overflow-hidden"
          style={{
            paddingLeft: CPA_LAYOUT.sideInsetPx,
            paddingRight: CPA_LAYOUT.sideInsetPx,
            paddingTop: CPA_LAYOUT.bodyTopPaddingPx,
          }}
        >
          {/* Payeur (§5.4.1-12) */}
          <div
            className="absolute max-w-[320px] text-[8pt] leading-snug uppercase tracking-wide text-black"
            style={{
              top: CPA_LAYOUT.emitterTopPx,
              left: CPA_LAYOUT.sideInsetPx,
            }}
          >
            <div className="text-[9pt] font-bold">
              {data.emitterName || "—"}
            </div>
            <div className="mt-px whitespace-pre-line normal-case">
              {data.emitterAddr || "—"}
            </div>
          </div>

          {/* N° chèque — §5.4.1 (4) : extrême droite, au-dessus de la date */}
          <div
            className="absolute font-mono text-[11pt] font-bold tracking-widest text-black"
            style={{
              top: CPA_LAYOUT.chequeNumTopPx,
              right: CPA_LAYOUT.sideInsetPx,
            }}
          >
            {chqNum}
          </div>

          {/* Zone DATE — §5.4.1 (6) */}
          <div
            className="absolute flex items-start gap-1.5"
            style={{
              top: CPA_LAYOUT.dateTopPx,
              right: CPA_LAYOUT.sideInsetPx,
            }}
          >
            <div className="flex h-[22px] shrink-0 items-center text-[8pt] font-bold tracking-wider text-black">
              DATE
            </div>
            <div className="flex items-start gap-0">
              <DateDigitGroup digits={dateParts.year} labels={dateLabels.year} />
              <DateDashField />
              <DateDigitGroup digits={dateParts.month} labels={dateLabels.month} />
              <DateDashField />
              <DateDigitGroup digits={dateParts.day} labels={dateLabels.day} />
            </div>
          </div>

          {/* Bénéficiaire + montant — zone de balayage §5.4.2 */}
          <div
            className="absolute"
            style={{
              top: CPA_LAYOUT.payeeRowTopPx,
              left: CPA_LAYOUT.sideInsetPx,
              right: CPA_LAYOUT.sideInsetPx,
            }}
          >
            <div className="flex items-end gap-0">
              <div className="shrink-0 pr-3 text-[7pt] font-bold uppercase leading-tight text-black">
                {locale === "en" ? (
                  <>
                    Pay to the order of
                    <br />
                    <span className="text-[6pt] font-normal normal-case text-slate-700">
                      Payez à l&apos;ordre de
                    </span>
                  </>
                ) : (
                  <>
                    Payez à l&apos;ordre de
                    <br />
                    <span className="font-normal normal-case">
                      Pay to the order of
                    </span>
                  </>
                )}
              </div>
              <div className="relative min-w-0 flex-1 border-b border-black pb-0.5 pl-1">
                <span className="block truncate text-[10pt] font-bold uppercase tracking-wide text-black">
                  {data.payee || "—"}
                </span>
                <span
                  aria-hidden
                  className="absolute -right-px bottom-0 top-0 w-px bg-black"
                />
              </div>
              <div className="ml-2 flex shrink-0 items-center">
                <div
                  className="flex items-center border border-black bg-white px-2 font-mono font-bold text-black"
                  style={{
                    width: CPA_LAYOUT.amountBoxWidthPx,
                    height: CPA_LAYOUT.amountBoxHeightPx,
                    fontSize: `${CPA_LAYOUT.amountBoxFontSizePt}pt`,
                  }}
                >
                  {formatConvenienceAmount(data.amount)}
                </div>
                <span
                  className="ml-[3px] flex shrink-0 items-center font-mono font-bold leading-none text-black"
                  style={{
                    fontSize: CPA_LAYOUT.amountDollarSignSizePx,
                    height: CPA_LAYOUT.amountBoxHeightPx,
                  }}
                >
                  $
                </span>
              </div>
            </div>
          </div>

          {/* Montant légal — §5.4.1 (9), min. 10 pt §5.3 */}
          <div
            className="absolute flex items-end border-b border-black pb-0.5"
            style={{
              top: CPA_LAYOUT.legalAmountTopPx,
              left: CPA_LAYOUT.sideInsetPx,
              right: CPA_LAYOUT.sideInsetPx,
            }}
          >
            <span className="max-w-[480px] truncate text-[10pt] font-bold uppercase tracking-wide text-black">
              {montantLettres}
            </span>
            <span className="mx-2 mb-1 min-w-[48px] flex-1 border-b border-dotted border-slate-500" />
            <span className="shrink-0 font-mono text-[10pt] font-bold text-black">
              {cents}/100
            </span>
            <span className="ml-1 shrink-0 text-[10pt] font-bold uppercase text-black">
              Dollars
            </span>
          </div>

          {/* Membre ACP — centré entre montant légal et mémo */}
          <div
            className="absolute flex max-w-[340px] items-center gap-1.5"
            style={{
              top: getBankTopPx(),
              left: CPA_LAYOUT.sideInsetPx,
              height: CPA_LAYOUT.bankBlockHeightPx,
            }}
          >
            <img
              src="/banque.png"
              alt=""
              width={24}
              height={24}
              loading="eager"
              decoding="sync"
              data-cheque-bank-logo
              className="mt-px h-6 w-6 shrink-0 object-contain"
            />
            <div className="min-w-0 overflow-hidden text-[7.5pt] leading-tight text-black">
              <div className="truncate text-[8.5pt] font-bold uppercase tracking-wide">
                {data.bankName || "—"}
              </div>
              <div className="mt-px line-clamp-2 whitespace-pre-line normal-case">
                {data.bankAddr || "—"}
              </div>
            </div>
          </div>

          {/* Mémo + signature — §5.4.1 (10), lignes alignées */}
          <div
            className="absolute"
            style={{
              bottom: CPA_LAYOUT.bodyFooterBottomPx,
              left: CPA_LAYOUT.sideInsetPx,
              right: CPA_LAYOUT.sideInsetPx,
            }}
          >
            <div className="flex items-end">
              <div
                className="flex min-h-[18px] shrink-0 items-end border-b border-black pb-0.5 text-[10pt] text-black"
                style={{ width: CPA_LAYOUT.signatureMemoWidthPx }}
              >
                <span className="text-[7pt] uppercase">Re / Memo</span>
                <span className="ml-2 font-semibold">{data.memo || "—"}</span>
              </div>
              <div
                className="ml-auto min-h-[18px] shrink-0 border-b border-black pb-0.5"
                style={{ width: CPA_LAYOUT.signatureLineWidthPx }}
              />
            </div>
            <div className="mt-0.5 flex">
              <div
                className="shrink-0"
                style={{ width: CPA_LAYOUT.signatureMemoWidthPx }}
              />
              <p
                className="ml-auto shrink-0 whitespace-nowrap text-center text-[7pt] font-bold uppercase tracking-tight text-black"
                style={{ width: CPA_LAYOUT.signatureLineWidthPx }}
              >
                Signature autorisée / Authorized signature
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative shrink-0 overflow-hidden bg-white"
          style={{ height: CPA_CHEQUE.micrBandPx }}
        >
          <MicrEncodingLine data={data} />
        </div>
      </div>
    </div>
  );
}

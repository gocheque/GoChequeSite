"use client";

import type { Dictionary } from "@/lib/i18n/dictionary-type";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type ShowcaseChequeMockProps = {
  progress: number;
  mock: Dictionary["showcase"]["mock"];
};

/**
 * Decorative marketing cheque — not the CPA 006 face, not used for print.
 * Fields fill in as scroll progress moves through Fill → Print → Sign → Send.
 */
export function ShowcaseChequeMock({ progress, mock }: ShowcaseChequeMockProps) {
  const fill = clamp(progress, 0, 1);
  const print = clamp(progress - 1, 0, 1);
  const sign = clamp(progress - 2, 0, 1);
  const send = clamp(progress - 3, 0, 1);

  const drawerOpacity = clamp(fill / 0.28, 0, 1);
  const payeeOpacity = clamp((fill - 0.22) / 0.28, 0, 1);
  const amountOpacity = clamp((fill - 0.45) / 0.28, 0, 1);
  const memoOpacity = clamp((fill - 0.68) / 0.28, 0, 1);

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div
        className="relative"
        style={{
          transform: `translateY(${send * -6}px) scale(${1 - send * 0.04})`,
          transition: "transform 0.45s ease",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[4px] border border-[#d9d4cc] bg-[#fffcf7] shadow-[0_18px_50px_-24px_rgba(11,31,51,0.35)]"
          style={{
            boxShadow:
              print > 0.15
                ? `0 18px 50px -24px rgba(11,31,51,0.35), 0 ${6 + print * 10}px 0 0 #efeae2, 0 ${12 + print * 16}px 0 0 #e4ddd3`
                : undefined,
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#eeeae3] px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="min-w-0">
              <p
                className="truncate text-[11px] font-semibold tracking-tight text-[#0b1f33] sm:text-xs"
                style={{ opacity: Math.max(drawerOpacity, 0.18) }}
              >
                {mock.drawer}
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-[#8a8073]">
                GoCheque
              </p>
            </div>
            <p
              className="shrink-0 text-[10px] tabular-nums text-[#5b6b7c] sm:text-xs"
              style={{ opacity: Math.max(drawerOpacity, 0.18) }}
            >
              {mock.date} {mock.dateValue}
            </p>
          </div>

          <div className="space-y-2.5 px-3 py-3 sm:space-y-3 sm:px-4 sm:py-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a8073]">
                {mock.payTo}
              </p>
              <p
                className="mt-0.5 border-b border-dotted border-[#d9d4cc] pb-0.5 text-[12px] font-medium text-[#0b1f33] sm:text-sm"
                style={{ opacity: payeeOpacity }}
              >
                {payeeOpacity > 0.08 ? mock.payee : "\u00a0"}
              </p>
            </div>

            <div className="flex items-end justify-between gap-3">
              <p
                className="min-w-0 flex-1 text-[10px] leading-snug text-[#5b6b7c] sm:text-xs"
                style={{ opacity: memoOpacity }}
              >
                {mock.memo} {mock.memoValue}
              </p>
              <p
                className="shrink-0 rounded-[3px] border border-[#0b1f33]/15 bg-white px-2 py-1 text-[12px] font-semibold tabular-nums text-[#0b1f33] sm:text-sm"
                style={{ opacity: amountOpacity }}
              >
                {mock.amount} {mock.dollars}
              </p>
            </div>

            <div className="flex items-end justify-between gap-4 pt-1">
              <div className="h-2 flex-1 rounded-sm bg-[#0b1f33]/[0.06]" aria-hidden />
              <div className="w-[42%] min-w-[6.5rem]">
                <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a8073]">
                  {mock.signature}
                </p>
                <svg
                  viewBox="0 0 120 36"
                  className="mt-0.5 h-7 w-full sm:h-8"
                  aria-hidden
                >
                  <path
                    d="M6 26c12-18 28 8 42-8 10-12 18 10 36-4 10-8 22 2 30 6"
                    fill="none"
                    stroke="#0b1f33"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: 1 - sign,
                      opacity: 0.2 + sign * 0.8,
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p
          className="pointer-events-none absolute -bottom-6 left-0 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a8073]"
          style={{ opacity: print > 0.35 && send < 0.4 ? print : 0 }}
        >
          {mock.printCaption}
        </p>
      </div>

      <div
        className="pointer-events-none absolute -right-1 top-[18%] w-[46%] max-w-[11.5rem] sm:-right-3 sm:w-[42%]"
        style={{
          opacity: send,
          transform: `translate3d(${(1 - send) * 18}px, ${(1 - send) * 10}px, 0)`,
        }}
        aria-hidden={send < 0.05}
      >
        <div className="rounded-[1.15rem] border-[3px] border-[#0b1f33] bg-[#0b1f33] p-1.5 shadow-[0_16px_40px_-18px_rgba(11,31,51,0.55)]">
          <div className="overflow-hidden rounded-[0.75rem] bg-[#fbfaf7] px-2 py-3">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#0b1f33]/20" />
            <div className="rounded-sm border border-[#eeeae3] bg-white px-1.5 py-2">
              <div className="h-1.5 w-10 rounded-sm bg-[#0b1f33]/15" />
              <div className="mt-1.5 h-1 w-full rounded-sm bg-[#ff6633]/50" />
              <div className="mt-1 h-1 w-2/3 rounded-sm bg-[#0b1f33]/10" />
            </div>
            <p className="mt-2 text-center text-[8px] font-medium uppercase tracking-[0.12em] text-[#5b6b7c]">
              {mock.sendCaption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

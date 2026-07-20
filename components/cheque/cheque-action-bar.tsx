"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";

export function ChequeActionBar() {
  const { t } = useLocale();
  const { user, tokenBalance, checkoutMode } = useAuth();

  const showBalance = (user || checkoutMode === "guest") && tokenBalance !== null;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#ff6633] px-4 py-2.5 text-sm font-bold tracking-wide text-white shadow-[0_0_16px_rgba(255,102,51,0.45)] transition-all duration-300 hover:bg-[#e05526] active:scale-[0.98]"
      >
        {t("editor.process")}
      </button>

      {showBalance ? (
        <div className="max-w-sm space-y-0.5 text-center text-xs leading-relaxed text-slate-500">
          <p>{t("editor.processFootnoteCost")}</p>
          <p className="font-medium text-slate-600">
            {tokenBalance! > 1
              ? t("editor.processFootnoteBalancePlural", {
                  count: tokenBalance!,
                })
              : t("editor.processFootnoteBalance", { count: tokenBalance! })}
          </p>
        </div>
      ) : null}
    </div>
  );
}

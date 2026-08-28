"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";

export function ChequeActionBar() {
  const { t } = useLocale();
  const { user, tokenBalance, checkoutMode } = useAuth();

  const showBalance = (user || checkoutMode === "guest") && tokenBalance !== null;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-md bg-[#0b1f33] px-4 py-3 text-sm font-semibold tracking-[0.08em] text-white transition hover:bg-[#16324c]"
      >
        {t("editor.process")}
      </button>

      {showBalance ? (
        <div className="max-w-sm space-y-1 text-center text-xs leading-relaxed text-[#5c6b7a]">
          <p>{t("editor.processFootnoteCost")}</p>
          <p className="font-medium text-[#0b1f33]">
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

"use client";

import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ModalCloseButton } from "@/components/ui/modal-close-button";

export function CreditsPurchaseModal() {
  const { t } = useLocale();
  const {
    creditsModalOpen,
    closeCreditsModal,
    tokenBalance,
    lastCreditsAdded,
  } = useAuth();

  if (!creditsModalOpen || lastCreditsAdded === null) return null;

  const balance = tokenBalance ?? 0;

  return (
    <div className="marketing-shell fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-[#0b1f33]/40 backdrop-blur-sm"
        onClick={closeCreditsModal}
      />
      <div className="relative w-full max-w-md rounded-lg border border-[#e7e4de] bg-white p-6 shadow-[0_24px_80px_rgba(11,31,51,0.18)]">
        <ModalCloseButton
          onClick={closeCreditsModal}
          className="absolute right-4 top-4"
        />

        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-md bg-[#0b1f33]/5 text-[#0b1f33]">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#0b1f33]">
            {t("credits.purchaseTitle")}
          </h2>
          <p className="mt-2 text-sm text-[#5c6b7a]">
            {lastCreditsAdded > 1
              ? t("credits.purchaseAddedPlural", { count: lastCreditsAdded })
              : t("credits.purchaseAdded", { count: lastCreditsAdded })}
          </p>
          <p className="mt-4 text-2xl font-semibold text-[#0b1f33]">
            {balance > 1
              ? t("credits.balancePlural", { count: balance })
              : t("credits.balance", { count: balance })}
          </p>
          <p className="mt-1 text-xs text-[#8a8074]">{t("credits.validityNote")}</p>
        </div>

        <button
          type="button"
          onClick={closeCreditsModal}
          className="mt-6 w-full rounded-md bg-[#0b1f33] py-3 text-sm font-semibold text-white transition hover:bg-[#16324c]"
        >
          {t("credits.continue")}
        </button>
      </div>
    </div>
  );
}

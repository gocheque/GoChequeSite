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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={closeCreditsModal}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <ModalCloseButton
          onClick={closeCreditsModal}
          className="absolute right-4 top-4"
        />

        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            {t("credits.purchaseTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {lastCreditsAdded > 1
              ? t("credits.purchaseAddedPlural", { count: lastCreditsAdded })
              : t("credits.purchaseAdded", { count: lastCreditsAdded })}
          </p>
          <p className="mt-4 text-2xl font-bold text-[#ff6633]">
            {balance > 1
              ? t("credits.balancePlural", { count: balance })
              : t("credits.balance", { count: balance })}
          </p>
          <p className="mt-1 text-xs text-slate-400">{t("credits.validityNote")}</p>
        </div>

        <button
          type="button"
          onClick={closeCreditsModal}
          className="mt-6 w-full rounded-xl bg-[#ff6633] py-3 text-sm font-semibold text-white transition hover:bg-[#e05526]"
        >
          {t("credits.continue")}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { PricingCards } from "@/components/tokens/pricing-cards";
import { purchaseTokenPackage } from "@/lib/tokens/purchase-client";

export function BuyTokensModal() {
  const { t, locale } = useLocale();
  const {
    buyTokensModalOpen,
    user,
    showCreditsPurchased,
    backToProcessModal,
    closeBuyTokensModal,
    traiterFlowActive,
    traiterCanReturnToProcess,
  } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!buyTokensModalOpen || !user) return null;

  async function handlePurchase(packageId: string) {
    setLoadingId(packageId);
    setError(null);

    try {
      const data = await purchaseTokenPackage(packageId, locale);

      if (data.redirected) return;

      closeBuyTokensModal();
      showCreditsPurchased(data.balance ?? 0, data.creditsAdded ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.errorPurchase"));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="marketing-shell fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-[#0b1f33]/40 backdrop-blur-sm"
        onClick={closeBuyTokensModal}
      />

      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-[#e7e4de] bg-[#f6f4f0] shadow-[0_24px_80px_rgba(11,31,51,0.18)]">
        <div className="sticky top-0 z-10 border-b border-[#e7e4de] bg-white/95 px-6 py-5 backdrop-blur-sm sm:px-8">
          {traiterFlowActive && traiterCanReturnToProcess && (
            <button
              type="button"
              onClick={backToProcessModal}
              className="absolute left-5 top-5 text-sm font-medium text-[#5c6b7a] transition hover:text-[#0b1f33] sm:left-8"
            >
              {t("pricing.buyModal.back")}
            </button>
          )}
          <ModalCloseButton
            onClick={closeBuyTokensModal}
            className="absolute right-4 top-4 sm:right-6"
          />

          <div className="mx-auto max-w-2xl pt-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8074]">
              {t("pricing.buyModal.label")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0b1f33] sm:text-3xl">
              {t("pricing.title")}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#0b1f33]">
              {t("pricing.buyModal.connected", { email: user.email ?? "" })}
            </p>
            <p className="mt-2 text-sm text-[#5c6b7a] sm:text-base">
              {traiterFlowActive && !traiterCanReturnToProcess
                ? t("pricing.buyModal.subtitleEmpty")
                : t("pricing.subtitle")}
            </p>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-8 sm:py-8">
          {error && (
            <p className="mx-auto mb-6 max-w-md rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <PricingCards
            user={user}
            loadingId={loadingId}
            onPurchase={handlePurchase}
          />
        </div>
      </div>
    </div>
  );
}

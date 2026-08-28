"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { PricingCards } from "@/components/tokens/pricing-cards";
import { purchaseTokenPackage } from "@/lib/tokens/purchase-client";

export function HomePricingSection() {
  const { t, dictionary, locale } = useLocale();
  const { user, showCreditsPurchased, requestAuthForPurchase } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePurchase(packageId: string) {
    if (!user) {
      requestAuthForPurchase();
      return;
    }

    setLoadingId(packageId);
    setError(null);

    try {
      const data = await purchaseTokenPackage(packageId, locale);
      const added = data.creditsAdded ?? 0;
      const balance = data.balance ?? 0;

      if (data.redirected) return;

      showCreditsPurchased(balance, added);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.errorPurchase"),
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section
      id={dictionary.anchors.pricing}
      className="scroll-mt-20 bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ff6633]">
            {t("pricing.label")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
            {t("pricing.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5b6b7c]">{t("pricing.subtitle")}</p>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-12">
          <PricingCards
            user={user}
            loadingId={loadingId}
            onPurchase={handlePurchase}
          />
        </div>
      </div>
    </section>
  );
}

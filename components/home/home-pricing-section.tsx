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
      className="relative border-t border-slate-100/80 bg-slate-50/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-3.5 py-1 text-xs font-semibold text-[#ff6633]">
            {t("pricing.label")}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("pricing.title")}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">{t("pricing.subtitle")}</p>
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

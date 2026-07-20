"use client";

import { Check, Coins, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useLocale } from "@/components/providers/locale-provider";
import {
  TOKEN_PACKAGES,
  formatPrice,
  getPackageSavingsPercent,
} from "@/lib/tokens/packages";

type PricingCardsProps = {
  user: User | null;
  loadingId: string | null;
  onPurchase: (packageId: string) => void;
};

export function PricingCards({ user, loadingId, onPurchase }: PricingCardsProps) {
  const { t, locale, dictionary } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {TOKEN_PACKAGES.map((pkg) => {
        const perCheque = formatPrice(
          Math.round(pkg.priceCents / pkg.tokens),
          locale,
        );
        const isPopular = pkg.popular;
        const isLoading = loadingId === pkg.id;
        const packageName =
          dictionary.pricing.packages[
            pkg.id as keyof typeof dictionary.pricing.packages
          ] ?? pkg.name;
        const savingsPercent = getPackageSavingsPercent(pkg);

        return (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl sm:p-6 ${
              isPopular
                ? "border-[#ff6633]/40 shadow-md shadow-orange-100/50 lg:scale-[1.02] lg:hover:scale-105"
                : "border-slate-200 hover:scale-[1.02]"
            }`}
          >
            {isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ff6633] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {t("pricing.popular")}
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff6633]">
                <Coins className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                {packageName}
              </h3>
            </div>

            <div className="mt-5">
              <span className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {formatPrice(pkg.priceCents, locale)}
              </span>
              <p className="mt-1 text-sm text-slate-500">
                {t("pricing.chequesUnit", {
                  count: pkg.tokens,
                  price: perCheque,
                })}
              </p>
            </div>

            <ul className="mt-5 flex-1 space-y-2.5 border-t border-slate-100 pt-5">
              {savingsPercent > 0 && (
                <li className="flex items-start gap-2 text-sm font-medium text-emerald-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {t("pricing.savingsVsPaper", {
                    percent: savingsPercent,
                    reference: t("pricing.paperChequeRef"),
                  })}
                </li>
              )}
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                {t("pricing.featureInstant")}
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                {t("pricing.featurePrintable", { count: pkg.tokens })}
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                {t("pricing.featureCpa")}
              </li>
            </ul>

            <button
              type="button"
              disabled={loadingId !== null}
              onClick={() => onPurchase(pkg.id)}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isPopular
                  ? "bg-[#ff6633] text-white hover:bg-[#e05526]"
                  : "border border-slate-200 bg-white text-slate-800 hover:border-[#ff6633]/40 hover:bg-orange-50/50"
              }`}
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : user ? (
                t("pricing.choosePlan")
              ) : (
                t("pricing.signInToBuy")
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

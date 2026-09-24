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
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
              className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 transition-all duration-200 hover:-translate-y-1 sm:p-8 ${
                isPopular
                  ? "border-2 border-[#ff6633] shadow-xl shadow-orange-500/10 lg:-translate-y-2 lg:hover:-translate-y-3"
                  : "border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff6633] to-[#ff8533] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {t("pricing.popular")}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">
                    {packageName}
                  </h3>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isPopular
                        ? "bg-orange-100 text-[#ff6633]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Coins className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                      {formatPrice(pkg.priceCents, locale)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">
                    {t("pricing.chequesUnit", {
                      count: pkg.tokens,
                      price: perCheque,
                    })}
                  </p>
                </div>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {savingsPercent > 0 && (
                    <li className="flex items-start gap-2.5 text-sm font-medium text-emerald-800">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>
                        {t("pricing.savingsVsPaper", {
                          percent: savingsPercent,
                          reference: t("pricing.paperChequeRef"),
                        })}
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                    <span>{t("pricing.featureInstant")}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                    <span>{t("pricing.featurePrintable", { count: pkg.tokens })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6633]" />
                    <span>{t("pricing.featureCpa")}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled={loadingId !== null}
                onClick={() => onPurchase(pkg.id)}
                className={`mt-8 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isPopular
                    ? "bg-[#ff6633] text-white shadow-md shadow-orange-500/25 hover:bg-[#ea5522] hover:shadow-lg hover:shadow-orange-500/35"
                    : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
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

      {/* Guarantees Bar */}
      {dictionary.pricing.guarantees && (
        <div className="mt-10 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs font-medium text-slate-600 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#ff6633]">✓</span>
            <span>{dictionary.pricing.guarantees.stripe}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#ff6633]">✓</span>
            <span>{dictionary.pricing.guarantees.noExpiry}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#ff6633]">✓</span>
            <span>{dictionary.pricing.guarantees.noSubscription}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#ff6633]">✓</span>
            <span>{dictionary.pricing.guarantees.cpa}</span>
          </div>
        </div>
      )}
    </div>
  );
}

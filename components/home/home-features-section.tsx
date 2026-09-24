"use client";

import { Building2, Lock, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMaxPackageSavingsPercent } from "@/lib/tokens/packages";

const FEATURE_ICONS = [Smartphone, ShieldCheck, Lock, Zap];

const CANADIAN_BANKS = [
  "Desjardins",
  "RBC Banque Royale",
  "TD Canada Trust",
  "BMO",
  "Banque Scotia",
  "CIBC",
  "Banque Nationale",
  "Tangerine",
];

export function HomeFeaturesSection() {
  const { dictionary, t } = useLocale();
  const maxSavings = getMaxPackageSavingsPercent();

  return (
    <section
      id={dictionary.anchors.features}
      className="relative bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-3.5 py-1 text-xs font-semibold text-[#ff6633]">
            {dictionary.nav.features}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("hero.titleBefore")}{" "}
            <span className="text-[#ff6633]">{t("hero.titleHighlight")}</span>, sans les contraintes
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Tout a été pensé pour vous faire gagner du temps avec une sécurité maximale.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {dictionary.features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index] ?? ShieldCheck;

            return (
              <div
                key={item.title}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#ff6633]/40 hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff6633] transition-colors group-hover:bg-[#ff6633] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#ff6633]">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {item.text.replace(/\{percent\}/g, String(maxSavings))}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bank Compatibility Banner */}
        <div className="mt-16 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ff6633]">
              <Building2 className="h-4 w-4" />
              <span>{dictionary.features.banksTitle}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {dictionary.features.banksSubtitle}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {CANADIAN_BANKS.map((bank) => (
                <span
                  key={bank}
                  className="rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#ff6633]/30 hover:text-slate-900"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

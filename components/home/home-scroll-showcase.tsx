"use client";

import { ArrowRight, PenLine, Printer, Signature, Smartphone } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const STEP_ICONS = [PenLine, Printer, Signature, Smartphone];

export function HomeScrollShowcase() {
  const { t, dictionary } = useLocale();
  const steps = dictionary.showcase.steps;

  return (
    <section
      id="comment-ca-marche"
      aria-label={dictionary.showcase.sectionLabel}
      className="relative border-y border-slate-100/80 bg-slate-50/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-3.5 py-1 text-xs font-semibold text-[#ff6633]">
            {t("showcase.badge")}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("showcase.title")}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            {t("showcase.subtitle")}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? PenLine;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.word}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#ff6633]/40 hover:shadow-lg hover:shadow-orange-500/5 sm:p-7"
              >
                {/* Step Top Bar: Icon + Step Number */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50/90 text-[#ff6633] transition-colors group-hover:bg-[#ff6633] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-2xl font-black text-slate-200 transition-colors group-hover:text-orange-200">
                      {step.number ?? `0${index + 1}`}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {step.word}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator Arrow */}
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-[#ff6633] transition-colors">
                  <span>Étape {index + 1}</span>
                  {!isLast && (
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

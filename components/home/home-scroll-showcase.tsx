"use client";

import { useLocale } from "@/components/providers/locale-provider";

export function HomeScrollShowcase() {
  const { dictionary } = useLocale();
  const { showcase } = dictionary;

  return (
    <section
      aria-label={showcase.sectionLabel}
      className="border-y border-[#eeeae3] bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
          {showcase.eyebrow}
        </p>
        <ol className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-8">
          {showcase.steps.map((step, index) => (
            <li key={step.word} className="min-w-0">
              <p className="text-xs font-medium tabular-nums tracking-[0.16em] text-[#8a8073]">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0b1f33] sm:text-[1.75rem]">
                {step.word}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5b6b7c]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

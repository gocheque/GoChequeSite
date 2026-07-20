"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { getMaxPackageSavingsPercent } from "@/lib/tokens/packages";

export function HomeFeaturesSection() {
  const { dictionary } = useLocale();
  const maxSavings = getMaxPackageSavingsPercent();

  return (
    <section id={dictionary.anchors.features} className="bg-transparent py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          {dictionary.nav.features}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {dictionary.features.items.map((item, index) => {
            const gradients = [
              "from-violet-500 to-purple-400",
              "from-blue-500 to-cyan-400",
              "from-emerald-500 to-teal-400",
              "from-orange-500 to-amber-400",
            ] as const;

            return (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:shadow-slate-200"
              >
                <div
                  className={`mb-6 h-1.5 w-12 rounded-full bg-gradient-to-r ${gradients[index] ?? gradients[0]}`}
                />
                <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#ff6633]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {item.text.replace(/\{percent\}/g, String(maxSavings))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

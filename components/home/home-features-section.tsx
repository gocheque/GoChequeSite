import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { getMaxPackageSavingsPercent } from "@/lib/tokens/packages";

type HomeFeaturesSectionProps = {
  dictionary: Dictionary;
};

export function HomeFeaturesSection({ dictionary }: HomeFeaturesSectionProps) {
  const maxSavings = getMaxPackageSavingsPercent();

  return (
    <section
      id={dictionary.anchors.features}
      className="border-t border-[#eeeae3] bg-[#fbfaf7] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0b1f33] sm:text-4xl">
          {dictionary.nav.features}
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-px bg-[#e7e4de] md:grid-cols-2">
          {dictionary.features.items.map((item, index) => (
            <div key={item.title} className="bg-[#fbfaf7] p-8 sm:p-10">
              <p className="text-xs font-medium tracking-[0.16em] text-[#ff6633]">
                0{index + 1}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-[#0b1f33]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5b6b7c]">
                {item.text.replace(/\{percent\}/g, String(maxSavings))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

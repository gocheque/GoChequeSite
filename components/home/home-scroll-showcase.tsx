"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const STEP_VH = 88;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HomeScrollShowcase() {
  const { t, dictionary } = useLocale();
  const steps = dictionary.showcase.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeIndex = clamp(
    Math.floor(scrollProgress),
    0,
    Math.max(0, steps.length - 1),
  );
  const activeStep = steps[activeIndex] ?? steps[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setScrollProgress(steps.length);
      return;
    }

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewport = window.innerHeight;
      const scrollable = section.offsetHeight - viewport;
      if (scrollable <= 0) return;

      const scrolled = window.scrollY - section.offsetTop;
      const ratio = clamp(scrolled / scrollable, 0, 1);
      setScrollProgress(ratio * steps.length);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [reducedMotion, steps.length]);

  function scrollToStep(index: number) {
    const section = sectionRef.current;
    if (!section) return;

    const viewport = window.innerHeight;
    const scrollable = section.offsetHeight - viewport;
    const ratio = steps.length <= 1 ? 0 : index / steps.length;
    const top = section.offsetTop + ratio * scrollable + 1;

    window.scrollTo({ top, behavior: "smooth" });
  }

  function wordReveal(index: number) {
    return clamp(scrollProgress - index, 0, 1);
  }

  const descriptionReveal = clamp(scrollProgress - activeIndex, 0, 1);
  const scrollHintOpacity = clamp(1 - scrollProgress * 2.8, 0, 1);

  if (reducedMotion) {
    return (
      <section
        aria-label={dictionary.showcase.sectionLabel}
        className="border-y border-[#eeeae3] bg-white py-24"
      >
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
            {dictionary.showcase.eyebrow}
          </p>
          <ol className="mt-12 space-y-10">
            {steps.map((step, index) => (
              <li key={step.word}>
                <p className="text-xs text-[#8a8073]">0{index + 1}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b1f33]">
                  {step.word}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7c]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label={dictionary.showcase.sectionLabel}
      className="relative bg-white"
      style={{ height: `${steps.length * STEP_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-white">
        <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div
            className="absolute inset-x-0 top-[18vh] flex flex-col items-center transition-opacity duration-500"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden={scrollHintOpacity < 0.05}
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
              {t("showcase.scrollHint")}
            </p>
            <ChevronDown
              className="mt-3 h-5 w-5 text-[#c4bdb3]"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
            {dictionary.showcase.eyebrow}
          </p>

          <nav
            aria-label={dictionary.showcase.sectionLabel}
            className="mt-8 flex w-full flex-col items-center"
          >
            {steps.map((step, index) => {
              const reveal = wordReveal(index);
              const isActive = index === activeIndex;

              return (
                <button
                  key={step.word}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => scrollToStep(index)}
                  className="rounded-md px-2 py-1"
                  style={{
                    opacity: Math.max(reveal, 0.18),
                    transform: `translateY(${(1 - reveal) * 16}px)`,
                    transition: "opacity 0.45s ease, transform 0.45s ease",
                  }}
                >
                  <span
                    className="block font-semibold tracking-[-0.04em] text-[#0b1f33]"
                    style={{
                      fontSize: isActive
                        ? "clamp(2.4rem, 8vw, 4.5rem)"
                        : "clamp(1.85rem, 6vw, 3.25rem)",
                      transition: "font-size 0.4s ease",
                    }}
                  >
                    {step.word}
                  </span>
                </button>
              );
            })}
          </nav>

          <p
            className="mt-10 max-w-sm text-sm leading-relaxed text-[#5b6b7c] sm:text-base"
            style={{
              opacity: descriptionReveal * 0.95,
              transform: `translateY(${(1 - descriptionReveal) * 8}px)`,
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {activeStep.description}
          </p>
        </div>
      </div>
    </section>
  );
}

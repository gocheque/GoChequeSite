"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { ShowcaseChequeMock } from "@/components/home/showcase-cheque-mock";

const STEP_VH = 92;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function HomeScrollShowcase() {
  const { dictionary } = useLocale();
  const { showcase } = dictionary;
  const steps = showcase.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const lastIndex = Math.max(0, steps.length - 1);
  const activeIndex = clamp(Math.floor(scrollProgress), 0, lastIndex);

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

    let frame = 0;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewport = window.innerHeight;
      const scrollable = section.offsetHeight - viewport;
      if (scrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const rect = section.getBoundingClientRect();
      const ratio = clamp(-rect.top / scrollable, 0, 1);
      setScrollProgress(ratio * steps.length);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, steps.length]);

  function scrollToStep(index: number) {
    const section = sectionRef.current;
    if (!section) return;

    const viewport = window.innerHeight;
    const scrollable = Math.max(section.offsetHeight - viewport, 0);
    const ratio = steps.length <= 1 ? 0 : index / (steps.length - 0.08);
    const top = section.offsetTop + clamp(ratio, 0, 1) * scrollable;

    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }

  if (reducedMotion) {
    return (
      <section
        aria-label={showcase.sectionLabel}
        className="border-y border-[#eeeae3] bg-[#fbfaf7] py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <ShowcaseChequeMock progress={steps.length} mock={showcase.mock} />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
              {showcase.eyebrow}
            </p>
            <ol className="mt-10 space-y-8">
              {steps.map((step, index) => (
                <li key={step.word}>
                  <p className="text-xs font-medium tabular-nums tracking-[0.16em] text-[#ff6633]">
                    0{index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0b1f33]">
                    {step.word}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b6b7c]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label={showcase.sectionLabel}
      className="relative bg-[#fbfaf7]"
      style={{ height: `${steps.length * STEP_VH}vh` }}
    >
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col overflow-x-clip overflow-y-hidden border-y border-[#eeeae3]">
        <div className="showcase-stage mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-10">
          <div className="mx-auto w-full max-w-lg shrink-0 lg:max-w-none">
            <ShowcaseChequeMock progress={scrollProgress} mock={showcase.mock} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8073]">
              {showcase.eyebrow}
            </p>

            <ol className="mt-6 space-y-1 sm:mt-8 sm:space-y-2">
              {steps.map((step, index) => {
                const complete = scrollProgress >= index + 0.85;
                const current = index === activeIndex && !complete;
                const upcoming = scrollProgress < index;

                return (
                  <li key={step.word}>
                    <button
                      type="button"
                      onClick={() => scrollToStep(index)}
                      aria-current={current ? "step" : undefined}
                      className="flex w-full items-start gap-3 rounded-md px-1 py-2.5 text-left transition hover:bg-white/70 sm:gap-4 sm:py-3"
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${
                          complete
                            ? "bg-[#0b1f33] text-white"
                            : current
                              ? "border border-[#ff6633] bg-white text-[#ff6633]"
                              : "border border-[#d9d4cc] bg-white text-[#8a8073]"
                        }`}
                      >
                        {complete ? (
                          <Check
                            className="h-3.5 w-3.5"
                            strokeWidth={2.4}
                            aria-hidden
                          />
                        ) : (
                          `0${index + 1}`
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-xl font-semibold tracking-tight sm:text-2xl ${
                            upcoming
                              ? "text-[#0b1f33]/40"
                              : "text-[#0b1f33]"
                          }`}
                        >
                          {step.word}
                        </span>
                        <span
                          className="mt-1 block text-sm leading-relaxed text-[#5b6b7c]"
                          style={{
                            opacity: upcoming ? 0.45 : 1,
                          }}
                        >
                          {step.description}
                        </span>
                        <span className="sr-only">
                          {complete
                            ? showcase.stepComplete
                            : current
                              ? showcase.stepCurrent
                              : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center sm:bottom-4">
          <div
            className="flex items-center gap-1.5"
            role="img"
            aria-label={showcase.progressLabel}
          >
            {steps.map((step, index) => {
              const filled = clamp(scrollProgress - index, 0, 1);

              return (
                <span
                  key={step.word}
                  className="relative h-1 w-7 overflow-hidden rounded-full bg-[#d9d4cc] sm:w-9"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-[#ff6633]"
                    style={{ width: `${filled * 100}%` }}
                  />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

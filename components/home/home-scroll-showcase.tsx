"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  FileText,
  KeyRound,
  PenLine,
  Printer,
  ScanLine,
  Send,
  Signature,
  Smartphone,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { DEFAULT_CHEQUE } from "@/lib/cheque/default-cheque";
import {
  formatMicrAccountField,
  formatMicrLine,
  formatMicrSerialField,
  formatMicrTransitField,
} from "@/lib/cheque/cpa-format";

const STEP_VH = 92;

type FloatingGlyph = {
  Icon: LucideIcon;
  step: number;
  position: string;
  size: number;
  floatClass: string;
};

type FloatingMicr = {
  text: string;
  step: number;
  position: string;
  sizeClass: string;
  floatClass: string;
};

type MicrStrip = {
  text: string;
  step: number;
  position: string;
  widthClass: string;
  sizeClass: string;
  floatClass: string;
};

function buildStepDecorations() {
  const serial = formatMicrSerialField(DEFAULT_CHEQUE);
  const transit = formatMicrTransitField(DEFAULT_CHEQUE);
  const account = formatMicrAccountField(DEFAULT_CHEQUE);
  const fullLine = formatMicrLine(DEFAULT_CHEQUE);

  const glyphs: FloatingGlyph[] = [
    // Étape 0 — Remplir / Fill
    {
      Icon: PenLine,
      step: 0,
      position: "left-[3%] top-[11%]",
      size: 52,
      floatClass: "showcase-float-a",
    },
    {
      Icon: FileText,
      step: 0,
      position: "right-[4%] top-[16%]",
      size: 42,
      floatClass: "showcase-float-b",
    },
    {
      Icon: PenLine,
      step: 0,
      position: "left-[10%] bottom-[26%]",
      size: 34,
      floatClass: "showcase-float-c",
    },
    // Étape 1 — Imprimer / Print
    {
      Icon: Printer,
      step: 1,
      position: "left-[3%] bottom-[15%]",
      size: 54,
      floatClass: "showcase-float-c",
    },
    {
      Icon: KeyRound,
      step: 1,
      position: "right-[4%] top-[20%]",
      size: 44,
      floatClass: "showcase-float-a",
    },
    {
      Icon: Printer,
      step: 1,
      position: "right-[10%] bottom-[24%]",
      size: 36,
      floatClass: "showcase-float-d",
    },
    // Étape 2 — Signer / Sign
    {
      Icon: Signature,
      step: 2,
      position: "right-[3%] top-[10%]",
      size: 56,
      floatClass: "showcase-float-b",
    },
    {
      Icon: ScanLine,
      step: 2,
      position: "left-[4%] top-[17%]",
      size: 44,
      floatClass: "showcase-float-d",
    },
    {
      Icon: Eye,
      step: 2,
      position: "right-[11%] bottom-[28%]",
      size: 38,
      floatClass: "showcase-float-a",
    },
    // Étape 3 — Envoyer / Send
    {
      Icon: Send,
      step: 3,
      position: "right-[3%] bottom-[12%]",
      size: 52,
      floatClass: "showcase-float-d",
    },
    {
      Icon: Smartphone,
      step: 3,
      position: "left-[4%] bottom-[18%]",
      size: 46,
      floatClass: "showcase-float-a",
    },
    {
      Icon: Send,
      step: 3,
      position: "left-[11%] top-[22%]",
      size: 34,
      floatClass: "showcase-float-b",
    },
    {
      Icon: ScanLine,
      step: 3,
      position: "right-[10%] top-[16%]",
      size: 40,
      floatClass: "showcase-float-c",
    },
    {
      Icon: Smartphone,
      step: 3,
      position: "left-[14%] top-[38%]",
      size: 32,
      floatClass: "showcase-float-d",
    },
    {
      Icon: Send,
      step: 3,
      position: "right-[14%] bottom-[30%]",
      size: 36,
      floatClass: "showcase-float-a",
    },
  ];

  const micr: FloatingMicr[] = [
    {
      text: "000104",
      step: 0,
      position: "right-[2%] top-[36%]",
      sizeClass: "text-lg sm:text-xl",
      floatClass: "showcase-float-c",
    },
    {
      text: "C",
      step: 0,
      position: "left-[2%] top-[30%]",
      sizeClass: "text-2xl sm:text-3xl",
      floatClass: "showcase-float-a",
    },
    {
      text: "1234567",
      step: 1,
      position: "right-[2%] bottom-[32%]",
      sizeClass: "text-base sm:text-lg",
      floatClass: "showcase-float-d",
    },
    {
      text: "C",
      step: 1,
      position: "left-[2%] bottom-[28%]",
      sizeClass: "text-2xl sm:text-3xl",
      floatClass: "showcase-float-c",
    },
    {
      text: "A10234",
      step: 2,
      position: "left-[2%] top-[38%]",
      sizeClass: "text-lg sm:text-xl",
      floatClass: "showcase-float-b",
    },
    {
      text: "D003",
      step: 2,
      position: "right-[2%] top-[42%]",
      sizeClass: "text-lg sm:text-xl",
      floatClass: "showcase-float-a",
    },
    {
      text: "A",
      step: 3,
      position: "left-[2%] top-[34%]",
      sizeClass: "text-2xl sm:text-3xl",
      floatClass: "showcase-float-b",
    },
    {
      text: "10234",
      step: 3,
      position: "right-[2%] bottom-[36%]",
      sizeClass: "text-base sm:text-lg",
      floatClass: "showcase-float-d",
    },
    {
      text: "D003",
      step: 3,
      position: "left-[10%] bottom-[24%]",
      sizeClass: "text-base sm:text-lg",
      floatClass: "showcase-float-c",
    },
    {
      text: "000104",
      step: 3,
      position: "right-[10%] top-[28%]",
      sizeClass: "text-base sm:text-lg",
      floatClass: "showcase-float-a",
    },
  ];

  const strips: MicrStrip[] = [
    {
      text: serial,
      step: 0,
      position: "top-[6%] left-[20%]",
      widthClass: "w-[min(15rem,40vw)]",
      sizeClass: "text-sm sm:text-base",
      floatClass: "showcase-float-c",
    },
    {
      text: account,
      step: 1,
      position: "bottom-[7%] left-[2%]",
      widthClass: "w-[min(17rem,42vw)]",
      sizeClass: "text-sm sm:text-base",
      floatClass: "showcase-float-d",
    },
    {
      text: transit,
      step: 2,
      position: "top-[6%] right-[2%]",
      widthClass: "w-[min(19rem,46vw)]",
      sizeClass: "text-sm sm:text-base",
      floatClass: "showcase-float-a",
    },
    {
      text: fullLine,
      step: 3,
      position: "bottom-[5%] left-1/2 -translate-x-1/2",
      widthClass: "w-[min(44rem,92vw)]",
      sizeClass: "text-sm sm:text-base md:text-lg",
      floatClass: "showcase-float-b",
    },
    {
      text: `${transit}${account}`,
      step: 3,
      position: "top-[7%] left-[2%]",
      widthClass: "w-[min(28rem,62vw)]",
      sizeClass: "text-xs sm:text-sm md:text-base",
      floatClass: "showcase-float-c",
    },
  ];

  return { glyphs, micr, strips };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Visibilité par étape — évite l’empilement ; la dernière étape reste décorée en fin de scroll. */
function decorationReveal(
  step: number,
  scrollProgress: number,
  totalSteps: number,
) {
  const entered = clamp(scrollProgress - step + 0.15, 0, 1);
  const stepFocus = clamp(1 - Math.abs(scrollProgress - (step + 0.5)) * 0.82, 0, 1);
  const isLastStep = step === totalSteps - 1;

  if (isLastStep && scrollProgress >= totalSteps - 0.45) {
    return clamp(entered, 0, 1);
  }

  const sectionExit = isLastStep
    ? 1
    : clamp(totalSteps - scrollProgress, 0, 0.35) / 0.35;

  return entered * stepFocus * sectionExit;
}

function FloatingIcon({
  glyph,
  reveal,
  animate,
}: {
  glyph: FloatingGlyph;
  reveal: number;
  animate: boolean;
}) {
  const { Icon, position, size, floatClass } = glyph;

  return (
    <div
      className={`pointer-events-none absolute ${position} text-[#ff6633]/80 transition-opacity duration-700 ease-out ${
        animate ? floatClass : ""
      }`}
      style={{
        opacity: reveal * 0.88,
      }}
      aria-hidden
    >
      <Icon size={size} strokeWidth={1.5} />
    </div>
  );
}

function FloatingMicrGlyph({
  glyph,
  reveal,
  animate,
}: {
  glyph: FloatingMicr;
  reveal: number;
  animate: boolean;
}) {
  const { text, position, sizeClass, floatClass } = glyph;

  return (
    <div
      className={`showcase-micr-glyph showcase-micr-glyph--accent pointer-events-none absolute ${position} ${sizeClass} transition-opacity duration-700 ease-out ${
        animate ? floatClass : ""
      }`}
      style={{
        opacity: reveal * 0.85,
      }}
      aria-hidden
    >
      {text}
    </div>
  );
}

function FloatingMicrStrip({
  strip,
  reveal,
  animate,
}: {
  strip: MicrStrip;
  reveal: number;
  animate: boolean;
}) {
  const { text, position, widthClass, sizeClass, floatClass } = strip;

  return (
    <div
      className={`pointer-events-none absolute ${position} ${widthClass} transition-opacity duration-700 ease-out ${
        animate ? floatClass : ""
      }`}
      style={{ opacity: reveal * 0.9 }}
      aria-hidden
    >
      <div className="rounded-md border border-[#ff6633]/25 bg-white/70 px-3 py-2.5 shadow-[0_8px_30px_-12px_rgba(255,102,51,0.15)] sm:px-4">
        <p
          className={`showcase-micr-glyph showcase-micr-glyph--accent ${sizeClass} w-full overflow-hidden text-ellipsis whitespace-nowrap`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function HomeScrollShowcase() {
  const { t, dictionary } = useLocale();
  const steps = dictionary.showcase.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { glyphs: floatingGlyphs, micr: floatingMicr, strips: micrStrips } =
    useMemo(() => buildStepDecorations(), []);

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

  const eyebrowReveal = clamp(scrollProgress * 1.4, 0, 1);
  const descriptionReveal = clamp(scrollProgress - activeIndex, 0, 1);
  const scrollHintOpacity = clamp(1 - scrollProgress * 2.8, 0, 1);
  const contentEntryOpacity = clamp(scrollProgress * 1.6, 0, 1);

  if (reducedMotion) {
    return (
      <section
        aria-label={dictionary.showcase.sectionLabel}
        className="border-y border-slate-100 bg-white py-20"
      >
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-sm font-medium text-slate-500">
            {dictionary.showcase.eyebrow}
          </p>
          <ul className="mt-10 space-y-6">
            {steps.map((step) => (
              <li key={step.word}>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">
                  {step.word}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </li>
            ))}
          </ul>
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
        <div className="relative mx-auto flex h-full w-full max-w-[90rem] items-center justify-center px-2 sm:px-4">
          <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
            {floatingGlyphs.map((glyph, index) => (
              <FloatingIcon
                key={`icon-${index}`}
                glyph={glyph}
                reveal={decorationReveal(glyph.step, scrollProgress, steps.length)}
                animate={!reducedMotion}
              />
            ))}

            {floatingMicr.map((glyph, index) => (
              <FloatingMicrGlyph
                key={`micr-${index}`}
                glyph={glyph}
                reveal={decorationReveal(glyph.step, scrollProgress, steps.length)}
                animate={!reducedMotion}
              />
            ))}

            {micrStrips.map((strip, index) => (
              <FloatingMicrStrip
                key={`strip-${index}`}
                strip={strip}
                reveal={decorationReveal(strip.step, scrollProgress, steps.length)}
                animate={!reducedMotion}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 top-[18vh] z-20 flex flex-col items-center transition-opacity duration-500 sm:top-[20vh]"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden={scrollHintOpacity < 0.05}
          >
            <p className="text-sm font-medium tracking-wide text-slate-400 sm:text-base">
              {t("showcase.scrollHint")}
            </p>
            <ChevronDown
              className="showcase-scroll-hint-chevron mt-3 h-7 w-7 text-slate-400"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>

          <div
            className="relative z-10 flex w-full max-w-2xl flex-col items-center px-4 text-center transition-opacity duration-500"
            style={{ opacity: contentEntryOpacity }}
          >
            <h2 className="sr-only">{activeStep.word}</h2>
            <p
              className="max-w-lg text-sm font-medium leading-snug text-slate-700 sm:text-base"
              style={{
                opacity: eyebrowReveal,
                transform: `translateY(${(1 - eyebrowReveal) * 12}px)`,
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {dictionary.showcase.eyebrow}
            </p>

            <nav
              aria-label={dictionary.showcase.sectionLabel}
              className="mt-6 flex w-full flex-col items-center"
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
                    className="rounded-lg px-1 py-0.5"
                    style={{
                      opacity: reveal,
                      transform: `translateY(${(1 - reveal) * 28}px)`,
                      transition:
                        "opacity 0.55s ease-out, transform 0.55s ease-out",
                    }}
                  >
                    <span
                      className="block font-black leading-[0.92] tracking-[-0.045em] text-slate-900"
                      style={{
                        fontSize: isActive
                          ? "clamp(2.75rem, 10vw, 5.75rem)"
                          : "clamp(2.5rem, 8.5vw, 5rem)",
                        transition: "font-size 0.45s ease-out",
                      }}
                    >
                      {step.word}
                    </span>
                  </button>
                );
              })}
            </nav>

            <p
              className="mt-8 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base"
              style={{
                opacity: descriptionReveal * 0.9,
                transform: `translateY(${(1 - descriptionReveal) * 10}px)`,
                transition: "opacity 0.45s ease, transform 0.45s ease",
              }}
            >
              {activeStep.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

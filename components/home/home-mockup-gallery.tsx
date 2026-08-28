"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";

const GALLERY_IMAGES = [
  { src: "/gallery/gocheque-1.webp", altKey: "gallery.items.editor" as const },
  { src: "/gallery/gocheque-2.webp", altKey: "gallery.items.preview" as const },
  { src: "/gallery/gocheque-3.webp", altKey: "gallery.items.print" as const },
  { src: "/gallery/gocheque-4.webp", altKey: "gallery.items.dashboard" as const },
] as const;

const SLIDE_INTERVAL_MS = 7000;
const TRANSITION_MS = 1300;
const GALLERY_IMAGE_WIDTH = 1920;
const GALLERY_IMAGE_HEIGHT = 980;

export function HomeMockupGallery() {
  const { t, dictionary } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (GALLERY_IMAGES.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const safeIndex = activeIndex % GALLERY_IMAGES.length;
  const previousIndex =
    (safeIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const mountedIndexes = useMemo(
    () => new Set<number>([safeIndex, previousIndex]),
    [previousIndex, safeIndex],
  );
  const activeSlide = GALLERY_IMAGES[safeIndex] ?? GALLERY_IMAGES[0];
  const transitionMs = reducedMotion ? 200 : TRANSITION_MS;

  return (
    <section
      id={dictionary.anchors.gallery}
      aria-labelledby="gallery-heading"
      className="scroll-mt-28 w-full pb-14 pt-2"
    >
      <h2 id="gallery-heading" className="sr-only">
        {t("gallery.sectionLabel")}
      </h2>
      <div className="relative mx-auto w-[min(100%,72rem)] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-sm border border-[#eeeae3] bg-white">
          <div className="pointer-events-none w-full" aria-hidden>
            <Image
              src={activeSlide.src}
              alt=""
              width={GALLERY_IMAGE_WIDTH}
              height={GALLERY_IMAGE_HEIGHT}
              className="invisible block h-auto w-full select-none"
              sizes="(max-width: 72rem) 100vw, 72rem"
              draggable={false}
            />
          </div>

          {GALLERY_IMAGES.map((item, index) => {
            if (!mountedIndexes.has(index)) return null;

            const isActive = index === safeIndex;

            return (
              <div
                key={item.src}
                className={`absolute inset-0 will-change-[opacity,transform] ${
                  isActive ? "z-10" : "z-0"
                }`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translate3d(0, 0, 0) scale(1)"
                    : "translate3d(0, 1.25rem, 0) scale(0.96)",
                  filter: isActive ? "blur(0px)" : "blur(3px)",
                  transition: reducedMotion
                    ? `opacity ${transitionMs}ms ease`
                    : `opacity ${transitionMs}ms ease, transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1), filter ${transitionMs}ms ease`,
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                <Image
                  src={item.src}
                  alt={t(item.altKey)}
                  width={GALLERY_IMAGE_WIDTH}
                  height={GALLERY_IMAGE_HEIGHT}
                  className="block h-auto w-full select-none"
                  sizes="(max-width: 72rem) 100vw, 72rem"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? undefined : "lazy"}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center gap-2.5">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-label={t(item.altKey)}
              aria-current={index === safeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === safeIndex
                  ? "w-6 bg-slate-800"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

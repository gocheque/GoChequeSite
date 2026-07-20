"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";

const ALL_GALLERY_IMAGES = [
  { src: "/GoCheque.png", altKey: "gallery.items.editor" as const },
  { src: "/GoCheque2.png", altKey: "gallery.items.preview" as const },
  { src: "/GoCheque3.png", altKey: "gallery.items.print" as const },
  { src: "/GoCheque4.png", altKey: "gallery.items.dashboard" as const },
] as const;

type GalleryImage = (typeof ALL_GALLERY_IMAGES)[number];

const SLIDE_INTERVAL_MS = 7000;
const TRANSITION_MS = 1300;
const GALLERY_IMAGE_WIDTH = 1600;
const GALLERY_IMAGE_HEIGHT = 900;

function probeImage(item: GalleryImage): Promise<GalleryImage | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(item);
    img.onerror = () => resolve(null);
    img.src = item.src;
  });
}

export function HomeMockupGallery() {
  const { t, dictionary } = useLocale();
  const [slides, setSlides] = useState<GalleryImage[]>([ALL_GALLERY_IMAGES[0]]);
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
    let cancelled = false;

    void Promise.all(ALL_GALLERY_IMAGES.map(probeImage)).then((results) => {
      if (cancelled) return;

      const available = results.filter(
        (item): item is GalleryImage => item !== null,
      );

      setSlides(available.length > 0 ? available : [ALL_GALLERY_IMAGES[0]]);
      setActiveIndex(0);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const safeIndex = useMemo(
    () => (activeIndex < slides.length ? activeIndex : 0),
    [activeIndex, slides.length],
  );

  const activeSlide = slides[safeIndex] ?? slides[0];
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
      <div className="relative mx-auto w-[min(100%,96rem)] px-3 sm:px-5 lg:px-8">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none w-full" aria-hidden>
            <Image
              src={activeSlide.src}
              alt=""
              width={GALLERY_IMAGE_WIDTH}
              height={GALLERY_IMAGE_HEIGHT}
              className="invisible block h-auto w-full select-none"
              sizes="(max-width: 96rem) 100vw, 96rem"
              draggable={false}
            />
          </div>

          {slides.map((item, index) => {
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
                  sizes="(max-width: 96rem) 100vw, 96rem"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <div className="mt-7 flex justify-center gap-2.5">
            {slides.map((item, index) => (
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
        )}
      </div>
    </section>
  );
}

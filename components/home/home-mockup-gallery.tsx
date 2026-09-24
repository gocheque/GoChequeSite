"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Eye, FileEdit, LayoutDashboard, Printer } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const GALLERY_ITEMS = [
  {
    src: "/GoCheque.png",
    tabKey: "editor" as const,
    altKey: "gallery.items.editor" as const,
    Icon: FileEdit,
  },
  {
    src: "/GoCheque2.png",
    tabKey: "preview" as const,
    altKey: "gallery.items.preview" as const,
    Icon: Eye,
  },
  {
    src: "/GoCheque3.png",
    tabKey: "print" as const,
    altKey: "gallery.items.print" as const,
    Icon: Printer,
  },
  {
    src: "/GoCheque4.png",
    tabKey: "dashboard" as const,
    altKey: "gallery.items.dashboard" as const,
    Icon: LayoutDashboard,
  },
] as const;

const SLIDE_INTERVAL_MS = 6000;
const GALLERY_IMAGE_WIDTH = 3147;
const GALLERY_IMAGE_HEIGHT = 1606;

export function HomeMockupGallery() {
  const { t, dictionary } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GALLERY_ITEMS.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id={dictionary.anchors.gallery}
      aria-labelledby="gallery-heading"
      className="scroll-mt-24 w-full pb-16 pt-4 sm:pb-24"
    >
      <h2 id="gallery-heading" className="sr-only">
        {t("gallery.sectionLabel")}
      </h2>

      <div className="relative mx-auto w-[min(100%,78rem)] px-4 sm:px-6 lg:px-8">
        {/* Interactive Tab Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:mb-8 sm:gap-3">
          {GALLERY_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const Icon = item.Icon;
            const tabTitle = t(`gallery.tabs.${item.tabKey}`);
            const tabDesc = t(`gallery.tabs.${item.tabKey}Desc`);

            return (
              <button
                key={item.tabKey}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-xs font-semibold transition-all sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm ${
                  isActive
                    ? "border border-slate-200/90 bg-white text-slate-900 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/5"
                    : "border border-transparent text-slate-500 hover:border-slate-200/60 hover:bg-white/60 hover:text-slate-800"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-50 text-[#ff6633]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span>{tabTitle}</span>
                  <span
                    className={`hidden text-[11px] font-normal sm:block ${
                      isActive ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {tabDesc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Image Display (native proportions, no redundant outer chrome) */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative mx-auto w-full"
        >
          {/* Subtle warm ambient glow behind the preview */}
          <div
            className="pointer-events-none absolute -inset-x-4 top-1/4 h-3/4 rounded-full bg-gradient-to-t from-orange-500/10 via-amber-500/5 to-transparent blur-3xl"
            aria-hidden
          />

          {/* Native Image Container (3147 / 1606) */}
          <div className="relative w-full aspect-[3147/1606] overflow-hidden drop-shadow-[0_20px_45px_rgba(15,23,42,0.12)] sm:drop-shadow-[0_25px_60px_rgba(15,23,42,0.14)]">
            {GALLERY_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.src}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    isActive
                      ? "opacity-100 scale-100 z-10 pointer-events-auto"
                      : "opacity-0 scale-[0.985] z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={item.src}
                    alt={t(item.altKey)}
                    width={GALLERY_IMAGE_WIDTH}
                    height={GALLERY_IMAGE_HEIGHT}
                    className="h-full w-full object-contain select-none"
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* Quick bullet indicators underneath */}
          <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6">
            {GALLERY_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.tabKey}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={t(`gallery.tabs.${item.tabKey}`)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-7 bg-slate-800"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

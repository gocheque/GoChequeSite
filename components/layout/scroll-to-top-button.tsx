"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const SHOW_AFTER_PX = 320;

export function ScrollToTopButton() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t("common.scrollToTop")}
      className={`fixed bottom-6 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6633] text-white shadow-[0_4px_20px_rgba(255,102,51,0.45)] transition-all duration-300 hover:bg-[#e05526] hover:shadow-[0_6px_24px_rgba(255,102,51,0.5)] active:scale-95 sm:right-6 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

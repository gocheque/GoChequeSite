"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CHEQUE } from "@/lib/cheque/default-cheque";
import {
  formatMicrAccountField,
  formatMicrLine,
  formatMicrSerialField,
  formatMicrTransitField,
} from "@/lib/cheque/cpa-format";

/** Vitesse de référence calibrée sur la 3e ligne (~44 s pour une bande type). */
const MICR_SCROLL_PX_PER_SEC = 50;

type MicrRow = {
  id: string;
  text: string;
  reverse?: boolean;
};

function buildMicrRows(): MicrRow[] {
  const serial = formatMicrSerialField(DEFAULT_CHEQUE);
  const transit = formatMicrTransitField(DEFAULT_CHEQUE);
  const account = formatMicrAccountField(DEFAULT_CHEQUE);
  const fullLine = formatMicrLine(DEFAULT_CHEQUE);
  const spacer = "    ";

  return [
    {
      id: "line-a",
      text: `${fullLine}${spacer}${serial}${spacer}${transit}${account}${spacer}`.repeat(5),
    },
    {
      id: "line-b",
      text: `${transit}${account}${spacer}${serial}${spacer}${fullLine}${spacer}`.repeat(5),
      reverse: true,
    },
    {
      id: "line-c",
      text: `C${DEFAULT_CHEQUE.transit}A${DEFAULT_CHEQUE.inst}${DEFAULT_CHEQUE.account}C${DEFAULT_CHEQUE.chqNum}${spacer}`.repeat(
        5,
      ),
    },
  ];
}

function MicrScrollRow({
  row,
  animate,
}: {
  row: MicrRow;
  animate: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(44);

  useLayoutEffect(() => {
    const span = trackRef.current?.querySelector("span");
    if (!span) return;

    const width = span.getBoundingClientRect().width;
    if (width <= 0) return;

    setDurationSec(width / MICR_SCROLL_PX_PER_SEC);
  }, [row.text]);

  useEffect(() => {
    const span = trackRef.current?.querySelector("span");
    if (!span || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const width = span.getBoundingClientRect().width;
      if (width > 0) {
        setDurationSec(width / MICR_SCROLL_PX_PER_SEC);
      }
    });

    observer.observe(span);
    return () => observer.disconnect();
  }, [row.text]);

  return (
    <div className="hero-micr-row overflow-hidden">
      <div
        ref={trackRef}
        className={`hero-micr-track flex w-max ${row.reverse ? "hero-micr-track--reverse" : ""}`}
        style={
          animate
            ? { animationDuration: `${durationSec}s` }
            : undefined
        }
        aria-hidden
      >
        <span className="hero-micr-glyph shrink-0">{row.text}</span>
        <span className="hero-micr-glyph shrink-0">{row.text}</span>
      </div>
    </div>
  );
}

export function HeroMicrMarquee() {
  const rows = useMemo(() => buildMicrRows(), []);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4" aria-hidden>
      <div className="relative overflow-hidden rounded-full border border-slate-200/80 bg-white/80 py-2 shadow-xs backdrop-blur-xs">
        <div className="hero-micr-marquee w-full">
          <MicrScrollRow row={rows[0]} animate={animate} />
        </div>
      </div>
    </div>
  );
}

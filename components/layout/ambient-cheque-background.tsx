"use client";

import { useEffect, useState } from "react";
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
import type { LucideIcon } from "lucide-react";
import { DEFAULT_CHEQUE } from "@/lib/cheque/default-cheque";
import {
  formatMicrAccountField,
  formatMicrLine,
  formatMicrSerialField,
  formatMicrTransitField,
} from "@/lib/cheque/cpa-format";

type AmbientIcon = {
  Icon: LucideIcon;
  position: string;
  size: number;
  driftClass: string;
};

type AmbientMicr = {
  text: string;
  position: string;
  sizeClass: string;
  driftClass: string;
};

type AmbientStrip = {
  text: string;
  position: string;
  widthClass: string;
  sizeClass: string;
  driftClass: string;
};

type AmbientDecor = {
  icons: AmbientIcon[];
  micrGlyphs: AmbientMicr[];
  micrStrips: AmbientStrip[];
};

function remapAmbientTop(position: string, top: string) {
  return position.replace(/top-\[[^\]]+\]/, top);
}

/** Même icônes / tailles que le fond site, densité adaptée à une section (~1 viewport). */
function buildSectionAccentDecor(site: AmbientDecor): AmbientDecor {
  const iconPicks: [number, string][] = [
    [0, "top-[8%]"],
    [9, "top-[30%]"],
    [14, "top-[52%]"],
    [19, "top-[72%]"],
    [23, "top-[88%]"],
  ];
  const micrPicks: [number, string][] = [
    [0, "top-[18%]"],
    [11, "top-[80%]"],
  ];
  const stripPicks: [number, string][] = [[1, "top-[42%]"]];

  return {
    icons: iconPicks.map(([index, top]) => ({
      ...site.icons[index],
      position: remapAmbientTop(site.icons[index].position, top),
    })),
    micrGlyphs: micrPicks.map(([index, top]) => ({
      ...site.micrGlyphs[index],
      position: remapAmbientTop(site.micrGlyphs[index].position, top),
    })),
    micrStrips: stripPicks.map(([index, top]) => ({
      ...site.micrStrips[index],
      position: remapAmbientTop(site.micrStrips[index].position, top),
    })),
  };
}

function buildSiteAmbientDecor(): AmbientDecor {
  const serial = formatMicrSerialField(DEFAULT_CHEQUE);
  const transit = formatMicrTransitField(DEFAULT_CHEQUE);
  const account = formatMicrAccountField(DEFAULT_CHEQUE);
  const fullLine = formatMicrLine(DEFAULT_CHEQUE);

  const icons: AmbientIcon[] = [
    { Icon: FileText, position: "left-[4%] top-[3%]", size: 30, driftClass: "showcase-ambient-a" },
    { Icon: Printer, position: "right-[5%] top-[5%]", size: 28, driftClass: "showcase-ambient-b" },
    { Icon: Signature, position: "left-[6%] top-[9%]", size: 32, driftClass: "showcase-ambient-c" },
    { Icon: PenLine, position: "right-[4%] top-[12%]", size: 26, driftClass: "showcase-ambient-d" },
    { Icon: FileText, position: "right-[8%] top-[18%]", size: 24, driftClass: "showcase-ambient-a" },
    { Icon: Printer, position: "left-[5%] top-[21%]", size: 28, driftClass: "showcase-ambient-b" },
    { Icon: Signature, position: "right-[6%] top-[26%]", size: 30, driftClass: "showcase-ambient-c" },
    { Icon: KeyRound, position: "left-[7%] top-[30%]", size: 22, driftClass: "showcase-ambient-d" },
    { Icon: FileText, position: "left-[4%] top-[36%]", size: 26, driftClass: "showcase-ambient-a" },
    { Icon: Printer, position: "right-[5%] top-[39%]", size: 30, driftClass: "showcase-ambient-b" },
    { Icon: Signature, position: "left-[8%] top-[44%]", size: 28, driftClass: "showcase-ambient-c" },
    { Icon: ScanLine, position: "right-[7%] top-[47%]", size: 24, driftClass: "showcase-ambient-d" },
    { Icon: FileText, position: "right-[10%] top-[53%]", size: 22, driftClass: "showcase-ambient-a" },
    { Icon: Printer, position: "left-[6%] top-[56%]", size: 28, driftClass: "showcase-ambient-b" },
    { Icon: Signature, position: "right-[4%] top-[61%]", size: 32, driftClass: "showcase-ambient-c" },
    { Icon: Eye, position: "left-[10%] top-[65%]", size: 20, driftClass: "showcase-ambient-d" },
    { Icon: Send, position: "right-[9%] top-[68%]", size: 24, driftClass: "showcase-ambient-a" },
    { Icon: FileText, position: "left-[5%] top-[73%]", size: 26, driftClass: "showcase-ambient-b" },
    { Icon: Printer, position: "right-[6%] top-[76%]", size: 28, driftClass: "showcase-ambient-c" },
    { Icon: Signature, position: "left-[7%] top-[81%]", size: 30, driftClass: "showcase-ambient-d" },
    { Icon: Smartphone, position: "right-[8%] top-[84%]", size: 22, driftClass: "showcase-ambient-a" },
    { Icon: FileText, position: "right-[5%] top-[89%]", size: 24, driftClass: "showcase-ambient-b" },
    { Icon: Printer, position: "left-[6%] top-[92%]", size: 26, driftClass: "showcase-ambient-c" },
    { Icon: Signature, position: "right-[12%] top-[95%]", size: 28, driftClass: "showcase-ambient-d" },
    { Icon: PenLine, position: "left-[16%] top-[15%]", size: 18, driftClass: "showcase-ambient-c" },
    { Icon: FileText, position: "right-[16%] top-[33%]", size: 20, driftClass: "showcase-ambient-a" },
    { Icon: Printer, position: "left-[18%] top-[50%]", size: 20, driftClass: "showcase-ambient-b" },
    { Icon: Signature, position: "right-[18%] top-[71%]", size: 22, driftClass: "showcase-ambient-d" },
  ];

  const micrGlyphs: AmbientMicr[] = [
    { text: "C", position: "left-[12%] top-[7%]", sizeClass: "text-xl", driftClass: "showcase-ambient-c" },
    { text: "A", position: "right-[11%] top-[11%]", sizeClass: "text-xl", driftClass: "showcase-ambient-a" },
    { text: "D003", position: "left-[15%] top-[24%]", sizeClass: "text-sm", driftClass: "showcase-ambient-d" },
    { text: "10234", position: "right-[14%] top-[31%]", sizeClass: "text-sm", driftClass: "showcase-ambient-b" },
    { text: "000104", position: "left-[9%] top-[41%]", sizeClass: "text-sm", driftClass: "showcase-ambient-a" },
    { text: "1234567", position: "right-[8%] top-[51%]", sizeClass: "text-xs sm:text-sm", driftClass: "showcase-ambient-c" },
    { text: "A10234", position: "left-[20%] top-[59%]", sizeClass: "text-xs sm:text-sm", driftClass: "showcase-ambient-d" },
    { text: "C", position: "right-[20%] top-[6%]", sizeClass: "text-lg", driftClass: "showcase-ambient-b" },
    { text: "D", position: "left-[22%] top-[48%]", sizeClass: "text-lg", driftClass: "showcase-ambient-c" },
    { text: "A", position: "right-[22%] top-[63%]", sizeClass: "text-lg", driftClass: "showcase-ambient-a" },
    { text: "000104", position: "left-[11%] top-[78%]", sizeClass: "text-xs sm:text-sm", driftClass: "showcase-ambient-b" },
    { text: "10234", position: "right-[11%] top-[86%]", sizeClass: "text-xs sm:text-sm", driftClass: "showcase-ambient-c" },
  ];

  const micrStrips: AmbientStrip[] = [
    {
      text: serial,
      position: "top-[2%] left-[26%]",
      widthClass: "w-[min(11rem,28vw)]",
      sizeClass: "text-[10px] sm:text-xs",
      driftClass: "showcase-ambient-a",
    },
    {
      text: transit,
      position: "top-[19%] right-[18%]",
      widthClass: "w-[min(13rem,32vw)]",
      sizeClass: "text-[10px] sm:text-xs",
      driftClass: "showcase-ambient-c",
    },
    {
      text: account,
      position: "top-[37%] left-[20%]",
      widthClass: "w-[min(12rem,30vw)]",
      sizeClass: "text-[10px] sm:text-xs",
      driftClass: "showcase-ambient-b",
    },
    {
      text: fullLine,
      position: "top-[55%] right-[6%]",
      widthClass: "w-[min(22rem,52vw)]",
      sizeClass: "text-[9px] sm:text-[10px]",
      driftClass: "showcase-ambient-d",
    },
    {
      text: serial,
      position: "top-[72%] left-[5%]",
      widthClass: "w-[min(11rem,28vw)]",
      sizeClass: "text-[10px] sm:text-xs",
      driftClass: "showcase-ambient-b",
    },
    {
      text: `${transit}${account}`,
      position: "top-[88%] right-[14%]",
      widthClass: "w-[min(18rem,44vw)]",
      sizeClass: "text-[9px] sm:text-[10px]",
      driftClass: "showcase-ambient-a",
    },
  ];

  return { icons, micrGlyphs, micrStrips };
}

const SITE_AMBIENT = buildSiteAmbientDecor();
const SECTION_ACCENT_DECOR = buildSectionAccentDecor(SITE_AMBIENT);

function useAmbientAnimate() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return animate;
}

type AmbientChequeBackgroundProps = {
  variant: "site" | "accent";
  decor?: AmbientDecor;
  opacity?: number;
  animate: boolean;
  className?: string;
};

export function AmbientChequeBackground({
  variant,
  decor = SITE_AMBIENT,
  opacity = 1,
  animate,
  className = "",
}: AmbientChequeBackgroundProps) {
  const isAccent = variant === "accent";
  const iconClass = isAccent ? "text-[#ff6633]/80" : "text-slate-400";
  const micrClass = isAccent
    ? "showcase-micr-glyph showcase-micr-glyph--accent"
    : "showcase-micr-glyph showcase-micr-glyph--ambient";
  const stripShellClass = isAccent
    ? "rounded border border-[#ff6633]/25 bg-white/60 px-2 py-1.5 shadow-sm backdrop-blur-[1px] sm:px-2.5"
    : "rounded border border-slate-200/55 bg-white/55 px-2 py-1.5 shadow-sm backdrop-blur-[1px] sm:px-2.5";

  if (opacity <= 0.01) return null;

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      {decor.icons.map(({ Icon, position, size, driftClass }, index) => (
        <div
          key={`ambient-icon-${index}`}
          className={`absolute ${iconClass} ${position} ${animate ? driftClass : ""}`}
        >
          <Icon size={size} strokeWidth={1.5} />
        </div>
      ))}

      {decor.micrGlyphs.map(({ text, position, sizeClass, driftClass }, index) => (
        <div
          key={`ambient-micr-${index}`}
          className={`${micrClass} absolute ${position} ${sizeClass} ${
            animate ? driftClass : ""
          }`}
        >
          {text}
        </div>
      ))}

      {decor.micrStrips.map(
        ({ text, position, widthClass, sizeClass, driftClass }, index) => (
          <div
            key={`ambient-strip-${index}`}
            className={`absolute ${position} ${widthClass} ${animate ? driftClass : ""}`}
          >
            <div className={stripShellClass}>
              <p
                className={`${micrClass} ${sizeClass} overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                {text}
              </p>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function SiteAmbientBackground() {
  const animate = useAmbientAnimate();

  return (
    <AmbientChequeBackground
      variant="site"
      opacity={0.68}
      animate={animate}
      className="absolute inset-0 min-h-full w-full"
    />
  );
}

export function SectionAccentBackground({ className = "" }: { className?: string }) {
  const animate = useAmbientAnimate();

  return (
    <AmbientChequeBackground
      variant="accent"
      decor={SECTION_ACCENT_DECOR}
      opacity={0.68}
      animate={animate}
      className={`absolute inset-0 ${className}`}
    />
  );
}

"use client";

type AmbientChequeBackgroundProps = {
  variant?: "site" | "accent";
  opacity?: number;
  className?: string;
  animate?: boolean;
};

export function AmbientChequeBackground({
  variant = "site",
  opacity = 1,
  className = "",
}: AmbientChequeBackgroundProps) {
  const isAccent = variant === "accent";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      {/* Top warm radial glow behind hero */}
      <div
        className="absolute left-1/2 -top-[10rem] -translate-x-1/2 w-[min(100vw,68rem)] h-[32rem] rounded-full blur-3xl"
        style={{
          background: isAccent
            ? "radial-gradient(ellipse at center, rgba(255,102,51,0.12) 0%, rgba(255,102,51,0) 70%)"
            : "radial-gradient(ellipse at center, rgba(255,102,51,0.08) 0%, rgba(248,250,252,0) 70%)",
        }}
      />

      {/* Subtle modern grid with radial falloff */}
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_15%,#000_60%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "3.5rem 3.5rem",
        }}
      />

      {/* Soft secondary ambient glow in mid-page */}
      <div
        className="absolute right-[5%] top-[45rem] w-[35rem] h-[35rem] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(255,102,51,0.05) 0%, rgba(241,245,249,0) 70%)",
        }}
      />
    </div>
  );
}

export function SiteAmbientBackground() {
  return <AmbientChequeBackground variant="site" opacity={1} />;
}

export function SectionAccentBackground({ className = "" }: { className?: string }) {
  return <AmbientChequeBackground variant="accent" opacity={1} className={className} />;
}


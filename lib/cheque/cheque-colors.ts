export type ChequeColorId = "blue" | "orange" | "green" | "grey" | "yellow";

export type ChequeColorTheme = {
  id: ChequeColorId;
  label: string;
  swatch: string;
  printBorderColor: string;
  accentStripeColor: string;
  backgroundColor: string;
  backgroundImage: string;
  frameBorder: string;
  frameBg: string;
};

export const CHEQUE_COLORS: ChequeColorTheme[] = [
  {
    id: "blue",
    label: "Bleu",
    swatch: "#3b82f6",
    printBorderColor: "#2563eb",
    accentStripeColor: "#1d4ed8",
    backgroundColor: "#f4f8ff",
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(59,130,246,0.06) 11px, rgba(59,130,246,0.06) 12px), radial-gradient(ellipse at 85% 15%, rgba(59,130,246,0.1) 0%, transparent 55%)",
    frameBorder: "border-blue-200/60",
    frameBg: "from-blue-50/90 via-sky-50/80 to-blue-50/40",
  },
  {
    id: "orange",
    label: "Orange",
    swatch: "#ff6633",
    printBorderColor: "#d94a1a",
    accentStripeColor: "#c2410c",
    backgroundColor: "#fff8f4",
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,102,51,0.06) 11px, rgba(255,102,51,0.06) 12px), radial-gradient(ellipse at 85% 15%, rgba(255,102,51,0.08) 0%, transparent 55%)",
    frameBorder: "border-[#ff6633]/20",
    frameBg: "from-[#ff6633]/12 via-orange-50/90 to-[#ff6633]/8",
  },
  {
    id: "green",
    label: "Vert",
    swatch: "#22c55e",
    printBorderColor: "#15803d",
    accentStripeColor: "#166534",
    backgroundColor: "#f4fff6",
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(34,197,94,0.06) 11px, rgba(34,197,94,0.06) 12px), radial-gradient(ellipse at 85% 15%, rgba(34,197,94,0.1) 0%, transparent 55%)",
    frameBorder: "border-emerald-200/60",
    frameBg: "from-emerald-50/90 via-green-50/80 to-emerald-50/40",
  },
  {
    id: "grey",
    label: "Gris",
    swatch: "#94a3b8",
    printBorderColor: "#64748b",
    accentStripeColor: "#475569",
    backgroundColor: "#f8fafc",
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(100,116,139,0.06) 11px, rgba(100,116,139,0.06) 12px), radial-gradient(ellipse at 85% 15%, rgba(100,116,139,0.08) 0%, transparent 55%)",
    frameBorder: "border-slate-200/80",
    frameBg: "from-slate-100/80 via-slate-50/90 to-slate-100/50",
  },
  {
    id: "yellow",
    label: "Jaune",
    swatch: "#eab308",
    printBorderColor: "#a16207",
    accentStripeColor: "#854d0e",
    backgroundColor: "#fffdf4",
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(234,179,8,0.08) 11px, rgba(234,179,8,0.08) 12px), radial-gradient(ellipse at 85% 15%, rgba(234,179,8,0.12) 0%, transparent 55%)",
    frameBorder: "border-yellow-200/70",
    frameBg: "from-yellow-50/90 via-amber-50/80 to-yellow-50/40",
  },
];

export const DEFAULT_CHEQUE_COLOR: ChequeColorId = "orange";

export function getChequeColorTheme(id: ChequeColorId): ChequeColorTheme {
  return CHEQUE_COLORS.find((c) => c.id === id) ?? CHEQUE_COLORS[1];
}

export function getChequePrintBorderColor(id: ChequeColorId): string {
  return getChequeColorTheme(id).printBorderColor;
}

/**
 * Safari / WebKit print rasterise souvent `transparent` en noir dans les gradients.
 * On remplace par la couleur de fond réelle pour l'impression.
 */
export function getChequePrintBackgroundImage(theme: ChequeColorTheme): string {
  return theme.backgroundImage.replace(/transparent/gi, theme.backgroundColor);
}

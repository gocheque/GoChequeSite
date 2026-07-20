/** 1 token = 1 impression / traitement de chèque */
export const TOKENS_PER_CHEQUE = 1;

/** Prix de référence d'un chèque papier préimprimé (comparaison marketing). */
export const PAPER_CHEQUE_PRICE_CENTS = 100;

export type TokenPackage = {
  id: string;
  name: string;
  tokens: number;
  priceCents: number;
  popular?: boolean;
};

export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: "pack_starter",
    name: "Démarrage",
    tokens: 15,
    priceCents: 1000,
  },
  {
    id: "pack_pro",
    name: "Pro",
    tokens: 50,
    priceCents: 2500,
    popular: true,
  },
  {
    id: "pack_volume",
    name: "Volume",
    tokens: 150,
    priceCents: 6000,
  },
];

export function getTokenPackage(id: string): TokenPackage | undefined {
  return TOKEN_PACKAGES.find((pkg) => pkg.id === id);
}

export function getPerChequePriceCents(pkg: TokenPackage): number {
  return Math.round(pkg.priceCents / pkg.tokens);
}

export function getSavingsPercentVsPaper(priceCentsPerCheque: number): number {
  const savings = PAPER_CHEQUE_PRICE_CENTS - priceCentsPerCheque;
  if (savings <= 0) return 0;
  return Math.round((savings / PAPER_CHEQUE_PRICE_CENTS) * 100);
}

export function getPackageSavingsPercent(pkg: TokenPackage): number {
  return getSavingsPercentVsPaper(getPerChequePriceCents(pkg));
}

export function getMaxPackageSavingsPercent(): number {
  return Math.max(...TOKEN_PACKAGES.map(getPackageSavingsPercent));
}

export function formatPrice(cents: number, locale: "fr" | "en" = "fr"): string {
  const isWholeDollar = cents % 100 === 0;
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: isWholeDollar ? 0 : 2,
    maximumFractionDigits: isWholeDollar ? 0 : 2,
  }).format(cents / 100);
}
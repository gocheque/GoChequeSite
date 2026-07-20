/**
 * Protection temporaire pré-lancement.
 * - SITE_ACCESS_PASSWORD : Basic Auth sur tout le site
 * - PURCHASES_ENABLED=false : bloque checkout / achats
 * Les achats sont aussi coupés tant que le mot de passe d'accès est actif
 * (sauf si PURCHASES_ENABLED=true explicitement).
 */

export function getSiteAccessPassword(): string | null {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  return password || null;
}

export function isSiteAccessLocked(): boolean {
  return Boolean(getSiteAccessPassword());
}

export function arePurchasesEnabled(): boolean {
  const flag = process.env.PURCHASES_ENABLED?.trim().toLowerCase();

  if (flag === "false" || flag === "0" || flag === "off") {
    return false;
  }

  if (flag === "true" || flag === "1" || flag === "on") {
    return true;
  }

  // Par défaut : pas d'achats tant que le site est verrouillé
  return !isSiteAccessLocked();
}

export function purchasesDisabledResponse() {
  return {
    error: "Les achats seront disponibles prochainement.",
    code: "PURCHASES_DISABLED" as const,
  };
}

export function isStripeConfigured(): boolean {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const webhook = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  return Boolean(
    secret &&
      webhook &&
      secret.startsWith("sk_") &&
      !secret.includes("your-stripe"),
  );
}

export function getStripeSecretKey(): string {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secret || !secret.startsWith("sk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant ou invalide dans .env (Dashboard Stripe > Developers > API keys)",
    );
  }

  return secret;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secret || !secret.startsWith("whsec_")) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET manquant ou invalide dans .env (Stripe CLI ou Dashboard webhooks)",
    );
  }

  return secret;
}

export function getSiteOrigin(fallback?: string | null): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (fallback) return fallback.replace(/\/$/, "");
  return "http://localhost:3000";
}

/** Origine pour les redirects Stripe — préfère le site d'où part l'achat. */
export function getStripeRedirectOrigin(requestOrigin?: string | null): string {
  const fromRequest = requestOrigin?.trim().replace(/\/$/, "");
  if (fromRequest) return fromRequest;
  return getSiteOrigin();
}

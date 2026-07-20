import Stripe from "stripe";
import { getStripeSecretKey, isStripeConfigured } from "@/lib/stripe/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe n'est pas configuré");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey(), {
      typescript: true,
    });
  }

  return stripeClient;
}

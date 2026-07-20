import type { User } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe/server";

/**
 * Trouve ou crée un client Stripe lié au compte GoCheque,
 * pour le portail factures et les prochains checkouts.
 */
export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  const stripe = getStripe();
  const email = user.email?.trim();

  if (!email) {
    throw new Error("EMAIL_REQUIRED");
  }

  try {
    const byMetadata = await stripe.customers.search({
      query: `metadata['userId']:'${user.id}'`,
      limit: 1,
    });
    if (byMetadata.data[0]?.id) {
      const existing = byMetadata.data[0];
      if (existing.email !== email) {
        await stripe.customers.update(existing.id, { email });
      }
      return existing.id;
    }
  } catch {
    // Search API indisponible — repli sur la liste par courriel
  }

  const byEmail = await stripe.customers.list({
    email,
    limit: 10,
  });

  const matched =
    byEmail.data.find((customer) => customer.metadata?.userId === user.id) ??
    byEmail.data.find((customer) => !customer.metadata?.userId) ??
    byEmail.data[0];

  if (matched) {
    await stripe.customers.update(matched.id, {
      email,
      metadata: {
        ...matched.metadata,
        userId: user.id,
      },
    });
    return matched.id;
  }

  const created = await stripe.customers.create({
    email,
    metadata: {
      userId: user.id,
    },
  });

  return created.id;
}

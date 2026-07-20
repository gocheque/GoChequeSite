import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTokenPackage } from "@/lib/tokens/packages";
import { purchaseCredits } from "@/lib/tokens/token-service";
import type { PurchaseResult } from "@/lib/tokens/types";

type StripeOrderRow = {
  id: string;
  stripe_checkout_session_id: string;
  user_id: string;
  package_id: string;
  status: string;
  granted_keys: { creditsAdded?: number } | null;
  balance_after: number | null;
  tokens_count: number;
};

function parseGrantedCredits(value: unknown, fallback: number): number {
  if (value && typeof value === "object" && "creditsAdded" in value) {
    const added = (value as { creditsAdded?: number }).creditsAdded;
    if (typeof added === "number") return added;
  }
  return fallback;
}

async function getOrderBySessionId(
  sessionId: string,
): Promise<StripeOrderRow | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("stripe_checkout_orders")
    .select(
      "id, stripe_checkout_session_id, user_id, package_id, status, granted_keys, balance_after, tokens_count",
    )
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") {
      throw new Error("STRIPE_ORDERS_TABLE_MISSING");
    }
    throw error;
  }

  return data as StripeOrderRow | null;
}

async function ensurePendingOrder(
  session: Stripe.Checkout.Session,
): Promise<StripeOrderRow> {
  const userId = session.metadata?.userId;
  const packageId = session.metadata?.packageId;

  if (!userId || !packageId) {
    throw new Error("INVALID_SESSION_METADATA");
  }

  const pkg = getTokenPackage(packageId);
  if (!pkg) {
    throw new Error("INVALID_PACKAGE");
  }

  const existing = await getOrderBySessionId(session.id);
  if (existing) return existing;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stripe_checkout_orders")
    .insert({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      user_id: userId,
      package_id: packageId,
      amount_cents: session.amount_total ?? pkg.priceCents,
      tokens_count: pkg.tokens,
      status: "pending",
    })
    .select(
      "id, stripe_checkout_session_id, user_id, package_id, status, granted_keys, balance_after, tokens_count",
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      const retry = await getOrderBySessionId(session.id);
      if (retry) return retry;
    }
    throw error;
  }

  return data as StripeOrderRow;
}

function completedResult(order: StripeOrderRow): PurchaseResult {
  return {
    balance: order.balance_after ?? 0,
    creditsAdded: parseGrantedCredits(order.granted_keys, order.tokens_count),
  };
}

export async function fulfillStripeCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<PurchaseResult> {
  if (session.payment_status !== "paid") {
    throw new Error("PAYMENT_NOT_COMPLETED");
  }

  const order = await ensurePendingOrder(session);

  if (order.status === "completed") {
    return completedResult(order);
  }

  const supabase = createAdminClient();

  const { data: claimed, error: claimError } = await supabase
    .from("stripe_checkout_orders")
    .update({ status: "processing" })
    .eq("stripe_checkout_session_id", session.id)
    .in("status", ["pending", "processing"])
    .select(
      "id, stripe_checkout_session_id, user_id, package_id, status, granted_keys, balance_after, tokens_count",
    )
    .maybeSingle();

  if (claimError) throw claimError;

  if (!claimed) {
    const latest = await getOrderBySessionId(session.id);
    if (latest?.status === "completed") {
      return completedResult(latest);
    }
    throw new Error("FULFILLMENT_IN_PROGRESS");
  }

  try {
    const result = await purchaseCredits(order.user_id, order.package_id);

    const { error: completeError } = await supabase
      .from("stripe_checkout_orders")
      .update({
        status: "completed",
        granted_keys: { creditsAdded: result.creditsAdded },
        balance_after: result.balance,
        completed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("stripe_checkout_session_id", session.id);

    if (completeError) throw completeError;

    return result;
  } catch (error) {
    await supabase
      .from("stripe_checkout_orders")
      .update({
        status: "failed",
        error_message:
          error instanceof Error ? error.message : "FULFILLMENT_FAILED",
      })
      .eq("stripe_checkout_session_id", session.id);

    throw error;
  }
}

export async function getFulfilledCheckoutResult(
  sessionId: string,
  userId: string,
): Promise<PurchaseResult | null> {
  const order = await getOrderBySessionId(sessionId);

  if (!order || order.user_id !== userId || order.status !== "completed") {
    return null;
  }

  return completedResult(order);
}

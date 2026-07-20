import { createAdminClient } from "@/lib/supabase/admin";
import { getTokenPackage } from "@/lib/tokens/packages";
import type {
  ConsumeResult,
  CreditTransaction,
  PurchaseResult,
} from "@/lib/tokens/types";

function isMissingCreditsSchema(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.code === "42883" ||
    (error.message?.includes("user_credits") ?? false) ||
    (error.message?.includes("purchase_credits") ?? false)
  );
}

function parsePurchaseResult(data: unknown): PurchaseResult {
  const row = data as { balance: number; credits_added: number };
  return {
    balance: row.balance ?? 0,
    creditsAdded: row.credits_added ?? 0,
  };
}

function parseConsumeResult(data: unknown): ConsumeResult {
  const row = data as { balance: number; consumed: number };
  return {
    balance: row.balance ?? 0,
    consumed: row.consumed ?? 0,
  };
}

export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (isMissingCreditsSchema(error)) {
      throw new Error("CREDITS_SCHEMA_MISSING");
    }
    throw error;
  }

  return data?.balance ?? 0;
}

export async function listUserCreditTransactions(
  userId: string,
  limit = 100,
): Promise<CreditTransaction[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("credit_transactions")
    .select(
      "id, user_id, delta, balance_after, reason, package_id, description, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingCreditsSchema(error)) {
      throw new Error("CREDITS_SCHEMA_MISSING");
    }
    throw error;
  }

  return (data ?? []) as CreditTransaction[];
}

export async function purchaseCredits(
  userId: string,
  packageId: string,
): Promise<PurchaseResult> {
  const pkg = getTokenPackage(packageId);
  if (!pkg) throw new Error("INVALID_PACKAGE");

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("purchase_credits", {
    p_user_id: userId,
    p_amount: pkg.tokens,
    p_package_id: pkg.id,
    p_description: `Achat forfait ${pkg.name} (${pkg.tokens} crédits)`,
  });

  if (error) {
    if (isMissingCreditsSchema(error)) {
      throw new Error("CREDITS_SCHEMA_MISSING");
    }
    throw error;
  }

  return parsePurchaseResult(data);
}

export async function consumeCredit(
  userId: string,
  amount = 1,
  description?: string,
): Promise<ConsumeResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("consume_credit", {
    p_user_id: userId,
    p_amount: amount,
    p_description: description ?? "Impression d'un chèque",
  });

  if (error) {
    if (error.message.includes("INSUFFICIENT_CREDITS")) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    if (isMissingCreditsSchema(error)) {
      throw new Error("CREDITS_SCHEMA_MISSING");
    }
    throw error;
  }

  return parseConsumeResult(data);
}

/** @deprecated Ancien alias — utilise getCreditBalance */
export async function getTokenBalance(owner: {
  mode: "user";
  userId: string;
}): Promise<number> {
  return getCreditBalance(owner.userId);
}

/** @deprecated Ancien alias — utilise purchaseCredits */
export async function purchaseTokens(
  owner: { mode: "user"; userId: string },
  packageId: string,
): Promise<PurchaseResult> {
  if (owner.mode !== "user") {
    throw new Error("USER_REQUIRED");
  }
  return purchaseCredits(owner.userId, packageId);
}

/** @deprecated Ancien alias — utilise consumeCredit */
export async function consumeToken(
  owner: { mode: "user"; userId: string },
  description?: string,
): Promise<ConsumeResult> {
  if (owner.mode !== "user") {
    throw new Error("USER_REQUIRED");
  }
  return consumeCredit(owner.userId, 1, description);
}

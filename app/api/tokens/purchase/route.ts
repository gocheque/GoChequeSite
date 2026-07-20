import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import {
  arePurchasesEnabled,
  purchasesDisabledResponse,
} from "@/lib/site/access-lock";
import { isStripeConfigured } from "@/lib/stripe/env";
import { purchaseCredits } from "@/lib/tokens/token-service";

const purchaseSchema = z.object({
  packageId: z.string().min(1),
});

export async function POST(request: Request) {
  if (!arePurchasesEnabled()) {
    return NextResponse.json(purchasesDisabledResponse(), { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = purchaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { packageId } = parsed.data;

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Connexion requise pour acheter des chèques" },
        { status: 401 },
      );
    }

    if (isStripeConfigured()) {
      return NextResponse.json(
        {
          error: "Paiement Stripe requis pour cet achat",
          code: "PAYMENT_REQUIRED",
        },
        { status: 402 },
      );
    }

    const result = await purchaseCredits(user.id, packageId);

    return NextResponse.json({
      balance: result.balance,
      creditsAdded: result.creditsAdded,
      message: "Crédits ajoutés avec succès",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_PACKAGE") {
      return NextResponse.json({ error: "Forfait invalide" }, { status: 400 });
    }

    if (error instanceof Error && error.message === "CREDITS_SCHEMA_MISSING") {
      return NextResponse.json(
        {
          error: "CREDITS_SCHEMA_MISSING",
          message:
            "Migration Supabase requise : exécutez supabase/migrations/007_user_credits.sql",
        },
        { status: 503 },
      );
    }

    console.error("[POST /api/tokens/purchase]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

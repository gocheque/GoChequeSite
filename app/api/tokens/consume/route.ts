import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { consumeCredit } from "@/lib/tokens/token-service";
import { TOKENS_PER_CHEQUE } from "@/lib/tokens/packages";

const consumeSchema = z.object({}).optional();

export async function POST(request: Request) {
  try {
    await request.json().catch(() => ({}));
    const parsed = consumeSchema.safeParse({});

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const result = await consumeCredit(
      user.id,
      TOKENS_PER_CHEQUE,
      "Impression d'un chèque",
    );

    return NextResponse.json({
      balance: result.balance,
      consumed: result.consumed,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "INSUFFICIENT_CREDITS" ||
        error.message === "INSUFFICIENT_TOKENS")
    ) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_CREDITS",
          message: "Crédits insuffisants",
        },
        { status: 402 },
      );
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

    console.error("[POST /api/tokens/consume]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

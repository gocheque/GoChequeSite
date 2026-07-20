import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  getCreditBalance,
  listUserCreditTransactions,
} from "@/lib/tokens/token-service";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ balance: 0, transactions: [] });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [balance, transactions] = await Promise.all([
      getCreditBalance(user.id),
      listUserCreditTransactions(user.id),
    ]);

    return NextResponse.json({ balance, transactions });
  } catch (error) {
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

    console.error("[GET /api/tokens/list]", error);
    return NextResponse.json(
      { error: "Impossible de charger les crédits" },
      { status: 500 },
    );
  }
}

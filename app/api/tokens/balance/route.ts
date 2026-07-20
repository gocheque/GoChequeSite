import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCreditBalance } from "@/lib/tokens/token-service";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ balance: 0, mode: "user" });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const balance = await getCreditBalance(user.id);
    return NextResponse.json({ balance, mode: "user" });
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

    console.error("[GET /api/tokens/balance]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

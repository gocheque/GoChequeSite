import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "DEPRECATED",
      message: "Les codes de clé ne sont plus pris en charge. Utilisez votre solde de crédits.",
    },
    { status: 410 },
  );
}

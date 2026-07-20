import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import {
  fulfillStripeCheckoutSession,
  getFulfilledCheckoutResult,
} from "@/lib/stripe/fulfill-checkout";
import { isStripeConfigured } from "@/lib/stripe/env";
import { getStripe } from "@/lib/stripe/server";

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id requis" }, { status: 400 });
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const existing = await getFulfilledCheckoutResult(sessionId, user.id);
    if (existing) {
      return NextResponse.json({
        status: "completed",
        balance: existing.balance,
        creditsAdded: existing.creditsAdded,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 403 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: session.payment_status,
        balance: null,
        creditsAdded: 0,
      });
    }

    const result = await fulfillStripeCheckoutSession(session);

    return NextResponse.json({
      status: "completed",
      balance: result.balance,
      creditsAdded: result.creditsAdded,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FULFILLMENT_IN_PROGRESS") {
      return NextResponse.json({
        status: "processing",
        balance: null,
        creditsAdded: 0,
      });
    }

    console.error("[GET /api/stripe/session]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  emailFromStripeSession,
  sendPaymentFailedEmail,
} from "@/lib/email/lifecycle";
import { localeFromUnknown } from "@/lib/email/locale";
import { getStripeWebhookSecret, isStripeConfigured } from "@/lib/stripe/env";
import { fulfillStripeCheckoutSession } from "@/lib/stripe/fulfill-checkout";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret(),
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await fulfillStripeCheckoutSession(session);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const email = emailFromStripeSession(session);
      if (email) {
        await sendPaymentFailedEmail({
          to: email,
          locale: localeFromUnknown(session.metadata?.locale),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[POST /api/stripe/webhook]", error);
    return NextResponse.json(
      { error: "Webhook invalide" },
      { status: 400 },
    );
  }
}

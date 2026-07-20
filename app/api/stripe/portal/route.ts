import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { isValidLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import { getStripeRedirectOrigin, isStripeConfigured } from "@/lib/stripe/env";
import { getStripe } from "@/lib/stripe/server";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe non configuré", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    let locale: Locale = "fr";
    try {
      const body = (await request.json()) as { locale?: string };
      if (isValidLocale(body.locale ?? "")) {
        locale = body.locale as Locale;
      }
    } catch {
      // body optionnel
    }

    const customerId = await getOrCreateStripeCustomer(user);
    const origin = getStripeRedirectOrigin(request.headers.get("origin"));
    const stripe = getStripe();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}${localizedPath(locale, "/dashboard/keys")}`,
    });

    if (!portalSession.url) {
      return NextResponse.json(
        { error: "Impossible d'ouvrir le portail Stripe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_REQUIRED") {
      return NextResponse.json(
        { error: "Une adresse courriel est requise pour voir les factures" },
        { status: 400 },
      );
    }

    console.error("[POST /api/stripe/portal]", error);
    return NextResponse.json(
      {
        error:
          "Impossible d'ouvrir le portail factures. Vérifiez que le portail client est activé dans Stripe.",
      },
      { status: 500 },
    );
  }
}

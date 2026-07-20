import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { getStripeRedirectOrigin, isStripeConfigured } from "@/lib/stripe/env";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import { getStripe } from "@/lib/stripe/server";
import { getTokenPackage } from "@/lib/tokens/packages";

const checkoutSchema = z.object({
  packageId: z.string().min(1),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe non configuré", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Connexion requise pour acheter des chèques" },
        { status: 401 },
      );
    }

    const locale = isValidLocale(parsed.data.locale ?? "")
      ? (parsed.data.locale as Locale)
      : "fr";

    const pkg = getTokenPackage(parsed.data.packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Forfait invalide" }, { status: 400 });
    }

    const dictionary = getDictionary(locale);
    const packageName =
      dictionary.pricing.packages[
        pkg.id as keyof typeof dictionary.pricing.packages
      ] ?? pkg.name;

    const origin = getStripeRedirectOrigin(request.headers.get("origin"));
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(user);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      invoice_creation: {
        enabled: true,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: pkg.priceCents,
            product_data: {
              name: `${packageName} — ${pkg.tokens} ${locale === "fr" ? "chèques" : "cheques"}`,
              metadata: {
                packageId: pkg.id,
              },
            },
          },
        },
      ],
      metadata: {
        userId: user.id,
        packageId: pkg.id,
        locale,
      },
      success_url: `${origin}${localizedPath(locale, "/dashboard/keys")}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localizedPath(locale, "/dashboard")}?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[POST /api/stripe/checkout]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

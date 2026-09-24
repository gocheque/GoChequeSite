import type { User } from "@supabase/supabase-js";
import type Stripe from "stripe";
import {
  passwordChangedCopy,
  paymentFailedCopy,
  receiptCopy,
  welcomeCopy,
} from "@/lib/email/copy";
import { localeFromUserMetadata } from "@/lib/email/locale";
import { renderBrandedEmail } from "@/lib/email/render";
import { sendTransactionalEmail } from "@/lib/email/send";
import { DEFAULT_SITE_URL } from "@/lib/email/brand";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatPrice } from "@/lib/tokens/packages";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
}

function appUrl(locale: Locale, path: string): string {
  return `${siteUrl()}${localizedPath(locale, path)}`;
}

export async function sendWelcomeEmail(options: {
  to: string;
  locale: Locale;
}): Promise<void> {
  const { locale, to } = options;
  const copy = welcomeCopy(locale, {
    siteUrl: siteUrl(),
    dashboardUrl: appUrl(locale, "/dashboard"),
  });

  await sendTransactionalEmail({
    to,
    subject:
      locale === "en"
        ? "Welcome to GoCheque"
        : "Bienvenue sur GoCheque",
    html: renderBrandedEmail({
      locale,
      preheader: copy.preheader,
      heading: copy.heading,
      paragraphs: copy.paragraphs,
      cta: { href: appUrl(locale, "/dashboard"), label: copy.cta },
      footer: copy.footer,
    }),
  });
}

export async function sendWelcomeEmailIfNeeded(user: User): Promise<void> {
  const email = user.email?.trim();
  if (!email) return;
  if (user.user_metadata?.welcome_email_sent === true) return;

  const locale = localeFromUserMetadata(user.user_metadata);
  await sendWelcomeEmail({ to: email, locale });
}

export async function sendPasswordChangedEmail(options: {
  to: string;
  locale: Locale;
}): Promise<void> {
  const { locale, to } = options;
  const copy = passwordChangedCopy(locale, siteUrl());

  await sendTransactionalEmail({
    to,
    subject:
      locale === "en"
        ? "Your GoCheque password was changed"
        : "Votre mot de passe GoCheque a été modifié",
    html: renderBrandedEmail({
      locale,
      preheader: copy.preheader,
      heading: copy.heading,
      paragraphs: copy.paragraphs,
      cta: { href: appUrl(locale, "/dashboard/account"), label: copy.cta },
      footer: copy.footer,
      ignore: copy.ignore,
    }),
  });
}

export async function sendPurchaseReceiptEmail(options: {
  to: string;
  locale: Locale;
  packageId: string;
  creditsAdded: number;
  balance: number;
  amountCents: number;
}): Promise<void> {
  const { locale, to } = options;
  const dictionary = getDictionary(locale);
  const packageName =
    dictionary.pricing.packages[
      options.packageId as keyof typeof dictionary.pricing.packages
    ] ?? options.packageId;

  const copy = receiptCopy(locale, {
    packageName,
    creditsAdded: options.creditsAdded,
    balance: options.balance,
    amountLabel: formatPrice(options.amountCents, locale),
    dashboardUrl: appUrl(locale, "/dashboard/keys"),
  });

  await sendTransactionalEmail({
    to,
    subject:
      locale === "en"
        ? `GoCheque receipt — ${options.creditsAdded} credit${options.creditsAdded === 1 ? "" : "s"}`
        : `Reçu GoCheque — ${options.creditsAdded} crédit${options.creditsAdded === 1 ? "" : "s"}`,
    html: renderBrandedEmail({
      locale,
      preheader: copy.preheader,
      heading: copy.heading,
      paragraphs: copy.paragraphs,
      cta: { href: appUrl(locale, "/dashboard/keys"), label: copy.cta },
      footer: copy.footer,
    }),
  });
}

export async function sendPaymentFailedEmail(options: {
  to: string;
  locale: Locale;
}): Promise<void> {
  const { locale, to } = options;
  const copy = paymentFailedCopy(locale);

  await sendTransactionalEmail({
    to,
    subject:
      locale === "en"
        ? "GoCheque — payment not completed"
        : "GoCheque — paiement non complété",
    html: renderBrandedEmail({
      locale,
      preheader: copy.preheader,
      heading: copy.heading,
      paragraphs: copy.paragraphs,
      cta: { href: appUrl(locale, "/dashboard"), label: copy.cta },
      footer: copy.footer,
      ignore: copy.ignore,
    }),
  });
}

export function emailFromStripeSession(
  session: Stripe.Checkout.Session,
): string | null {
  const fromCustomer =
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    null;
  return fromCustomer;
}

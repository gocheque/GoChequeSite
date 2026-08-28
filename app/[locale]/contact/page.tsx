import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactPageContent } from "@/components/legal/contact-page-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return buildPageMetadata({
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    path: `/${locale}/contact`,
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return <ContactPageContent locale={locale} dictionary={dict} />;
}

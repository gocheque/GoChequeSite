import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
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
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    path: `/${locale}/privacy`,
    locale,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const { privacy } = dict;

  return (
    <LegalDocumentPage
      locale={locale}
      dictionary={dict}
      title={privacy.title}
      lastUpdated={privacy.lastUpdated}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}

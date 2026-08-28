import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/json-ld";

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
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(privacy.metaDescription),
          buildWebPageJsonLd(
            privacy.metaTitle,
            privacy.metaDescription,
            `/${locale}/privacy`,
            locale,
          ),
        ]}
      />
      <LegalDocumentPage
        locale={locale}
        dictionary={dict}
        title={privacy.title}
        lastUpdated={privacy.lastUpdated}
        intro={privacy.intro}
        sections={privacy.sections}
      />
    </>
  );
}

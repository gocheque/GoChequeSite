import { notFound, redirect } from "next/navigation";
import { AuthSessionSync } from "@/components/auth/auth-session-sync";
import { AppNavbar } from "@/components/layout/app-navbar";
import { StripeCheckoutReturnBoundary } from "@/components/stripe/stripe-checkout-return-boundary";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAuthUser } from "@/lib/auth/get-user";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, localizedPath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return buildPageMetadata({
    title: dict.meta.dashboardTitle,
    description: dict.meta.dashboardDescription,
    path: `/${locale}/dashboard`,
    locale,
    noIndex: true,
  });
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const user = await getAuthUser();

  if (!user) {
    redirect(localizedPath(locale));
  }

  return (
    <div className="min-h-screen bg-white antialiased">
      <AuthSessionSync />
      <StripeCheckoutReturnBoundary />
      <AppNavbar />
      <main className="w-full px-4 pb-10 pt-28 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

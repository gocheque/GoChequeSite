import { redirect, notFound } from "next/navigation";
import { AccountSettingsForm } from "@/components/dashboard/account-settings-form";
import { getAuthUser } from "@/lib/auth/get-user";
import { isValidLocale, localizedPath, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function DashboardAccountPage({
  params,
}: {
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
    <section className="w-full">
      <AccountSettingsForm />
    </section>
  );
}

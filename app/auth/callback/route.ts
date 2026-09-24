import { NextResponse } from "next/server";
import { localeFromPath, localeFromUserMetadata } from "@/lib/email/locale";
import { sendWelcomeEmail } from "@/lib/email/lifecycle";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/fr/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safeNext =
        next.startsWith("/") && !next.startsWith("//") ? next : "/fr/dashboard";
      const locale = localeFromPath(safeNext);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          const metadata = user.user_metadata ?? {};
          const resolvedLocale = metadata.locale
            ? localeFromUserMetadata(metadata)
            : locale;
          const alreadyWelcomed = metadata.welcome_email_sent === true;
          const isRecovery = safeNext.includes("/auth/reset-password");

          if (!alreadyWelcomed && !isRecovery) {
            await sendWelcomeEmail({ to: user.email, locale: resolvedLocale });
          }

          if (
            metadata.locale !== resolvedLocale ||
            (!alreadyWelcomed && !isRecovery)
          ) {
            await supabase.auth.updateUser({
              data: {
                locale: resolvedLocale,
                welcome_email_sent: alreadyWelcomed || !isRecovery,
              },
            });
          }
        }
      } catch (welcomeError) {
        console.error("[auth/callback] welcome email", welcomeError);
      }

      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/fr?auth=error`);
}

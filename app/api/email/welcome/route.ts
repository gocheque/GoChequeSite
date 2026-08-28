import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { sendWelcomeEmail } from "@/lib/email/lifecycle";
import { localeFromUnknown, localeFromUserMetadata } from "@/lib/email/locale";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (user.user_metadata?.welcome_email_sent === true) {
    return NextResponse.json({ sent: false, skipped: true });
  }

  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = body.locale
    ? localeFromUnknown(body.locale)
    : localeFromUserMetadata(user.user_metadata);

  try {
    await sendWelcomeEmail({ to: user.email, locale });

    const supabase = await createClient();
    await supabase.auth.updateUser({
      data: { locale, welcome_email_sent: true },
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("[POST /api/email/welcome]", error);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 500 });
  }
}

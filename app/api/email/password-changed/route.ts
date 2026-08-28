import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { sendPasswordChangedEmail } from "@/lib/email/lifecycle";
import { localeFromUnknown, localeFromUserMetadata } from "@/lib/email/locale";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = body.locale
    ? localeFromUnknown(body.locale)
    : localeFromUserMetadata(user.user_metadata);

  try {
    await sendPasswordChangedEmail({ to: user.email, locale });
    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("[POST /api/email/password-changed]", error);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 500 });
  }
}

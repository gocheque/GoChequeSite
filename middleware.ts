import { type NextRequest, NextResponse } from "next/server";
import {
  getLocaleFromPathname,
  getPreferredLocale,
  LOCALE_COOKIE,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

function pathnameHasLocale(pathname: string): boolean {
  return Boolean(getLocaleFromPathname(pathname));
}

function withLocaleCookie(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next")
  ) {
    return updateSession(request);
  }

  const pathLocale = getLocaleFromPathname(pathname);

  if (pathLocale) {
    const response = await updateSession(request);
    response.headers.set("x-locale", pathLocale);
    return withLocaleCookie(response, pathLocale);
  }

  const preferredLocale = getPreferredLocale(
    request.cookies.get(LOCALE_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  url.pathname = localizedPath(preferredLocale, suffix);

  const response = NextResponse.redirect(url);
  return withLocaleCookie(response, preferredLocale);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf)$).*)",
  ],
};

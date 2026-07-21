import { type NextRequest, NextResponse } from "next/server";
import {
  getLocaleFromPathname,
  getPreferredLocale,
  LOCALE_COOKIE,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import {
  getSiteAccessPassword,
  isSiteAccessLocked,
} from "@/lib/site/access-lock";
import { updateSession } from "@/lib/supabase/middleware";

function withLocaleCookie(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function unauthorizedPreview(): NextResponse {
  return new NextResponse("GoCheque — accès anticipé requis", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GoCheque Preview", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function isAuthorizedPreview(request: NextRequest, password: string): boolean {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;

    const user = decoded.slice(0, separator);
    const pass = decoded.slice(separator + 1);
    const expectedUser = process.env.SITE_ACCESS_USER?.trim() || "gocheque";

    return user === expectedUser && pass === password;
  } catch {
    return false;
  }
}

function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/(fr|en)(?=\/)/, "") || pathname;
}

function isRootPublicFile(pathname: string): boolean {
  const bare = stripLocalePrefix(pathname);
  return (
    bare === "/manifest.webmanifest" ||
    bare === "/site.webmanifest" ||
    bare === "/robots.txt" ||
    bare === "/sitemap.xml"
  );
}

function isAuthBypassPath(pathname: string): boolean {
  return (
    pathname === "/api/stripe/webhook" ||
    pathname === "/api/health/env" ||
    isRootPublicFile(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const bypassAuth = isAuthBypassPath(pathname);

  if (isSiteAccessLocked() && !bypassAuth) {
    const password = getSiteAccessPassword()!;
    if (!isAuthorizedPreview(request, password)) {
      return unauthorizedPreview();
    }
  }

  // /fr/manifest.webmanifest → servir le fichier racine (évite 401 + 404)
  if (isRootPublicFile(pathname)) {
    const bare = stripLocalePrefix(pathname);
    if (bare !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = bare;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

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

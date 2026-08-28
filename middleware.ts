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
import { isPreviewOrLocalHost, isProductionPublicHost } from "@/lib/seo/hosts";
import { updateSession } from "@/lib/supabase/middleware";

function withLocaleCookie(response: NextResponse, locale: Locale): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function requestHost(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.trim() ||
    ""
  );
}

function withPreviewRobots(response: NextResponse, host: string): NextResponse {
  if (isPreviewOrLocalHost(host) && host.includes("vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
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
    bare === "/sitemap.xml" ||
    /^\/google[a-f0-9]+\.html$/i.test(bare)
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
  const host = requestHost(request);
  const bypassAuth = isAuthBypassPath(pathname);
  const onProduction = isProductionPublicHost(host);

  if (isSiteAccessLocked() && !bypassAuth && !onProduction) {
    const password = getSiteAccessPassword()!;
    if (!isAuthorizedPreview(request, password)) {
      return unauthorizedPreview();
    }
  }

  if (isRootPublicFile(pathname)) {
    const bare = stripLocalePrefix(pathname);
    if (bare !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = bare;
      return withPreviewRobots(NextResponse.rewrite(url), host);
    }
    return withPreviewRobots(NextResponse.next(), host);
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next")
  ) {
    return withPreviewRobots(await updateSession(request), host);
  }

  const pathLocale = getLocaleFromPathname(pathname);

  if (pathLocale) {
    const response = await updateSession(request);
    response.headers.set("x-locale", pathLocale);
    return withPreviewRobots(withLocaleCookie(response, pathLocale), host);
  }

  const preferredLocale = getPreferredLocale(
    request.cookies.get(LOCALE_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  url.pathname = localizedPath(preferredLocale, suffix);

  const response = NextResponse.redirect(url);
  return withPreviewRobots(withLocaleCookie(response, preferredLocale), host);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|ttf)$).*)",
  ],
};

import { Comfortaa } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { htmlLang, type Locale } from "@/lib/i18n/config";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { siteViewport } from "@/lib/seo/site";
import { readSupabasePublicConfigFromEnv } from "@/lib/supabase/env";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const generateMetadata = buildRootMetadata;
export const viewport = siteViewport;

function resolveDocumentLang(headerLocale: string | null): string {
  if (headerLocale === "en" || headerLocale === "fr") {
    return htmlLang(headerLocale as Locale);
  }
  return htmlLang("fr");
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const lang = resolveDocumentLang(headerStore.get("x-locale"));
  const supabasePublic = readSupabasePublicConfigFromEnv();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${comfortaa.variable} min-h-screen bg-white font-sans text-slate-900 antialiased`}
      >
        {supabasePublic ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `self.__GOCHEQUE_SB__=${JSON.stringify(supabasePublic)};`,
            }}
          />
        ) : null}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

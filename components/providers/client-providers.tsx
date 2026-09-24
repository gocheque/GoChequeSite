"use client";

import { useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteAmbientShell } from "@/components/layout/site-ambient-shell";
import { AuthModal } from "@/components/auth/auth-modal";
import { BuyTokensModal } from "@/components/tokens/buy-tokens-modal";
import { ProcessModeModal } from "@/components/tokens/process-mode-modal";
import { CreditsPurchaseModal } from "@/components/tokens/credits-purchase-modal";
import { LegalConsentBanner } from "@/components/legal/legal-consent-banner";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";
import {
  setSupabasePublicConfig,
  type SupabasePublicConfig,
} from "@/lib/supabase/env";

const ChequePrintMobileModal = dynamic(
  () =>
    import("@/components/cheque/cheque-print-mobile-modal").then(
      (mod) => mod.ChequePrintMobileModal,
    ),
  { ssr: false },
);

function DashboardPrintModal() {
  const pathname = usePathname();
  if (!pathname?.includes("/dashboard")) return null;
  return <ChequePrintMobileModal />;
}

type ClientProvidersProps = {
  children: React.ReactNode;
  initialUser?: User | null;
  supabasePublic?: SupabasePublicConfig | null;
};

export function ClientProviders({
  children,
  initialUser = null,
  supabasePublic = null,
}: ClientProvidersProps) {
  if (supabasePublic) {
    setSupabasePublicConfig(supabasePublic);
  }

  useLayoutEffect(() => {
    if (supabasePublic) {
      setSupabasePublicConfig(supabasePublic);
    }
  }, [supabasePublic]);

  return (
    <AuthProvider initialUser={initialUser}>
      <SiteAmbientShell>
        {children}
      </SiteAmbientShell>
      <AuthModal />
      <ProcessModeModal />
      <DashboardPrintModal />
      <BuyTokensModal />
      <CreditsPurchaseModal />
      <LegalConsentBanner />
      <ScrollToTopButton />
    </AuthProvider>
  );
}

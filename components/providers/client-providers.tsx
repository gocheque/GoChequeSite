"use client";

import type { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteAmbientShell } from "@/components/layout/site-ambient-shell";
import { AuthModal } from "@/components/auth/auth-modal";
import { BuyTokensModal } from "@/components/tokens/buy-tokens-modal";
import { ProcessModeModal } from "@/components/tokens/process-mode-modal";
import { CreditsPurchaseModal } from "@/components/tokens/credits-purchase-modal";
import { ChequePrintMobileModal } from "@/components/cheque/cheque-print-mobile-modal";
import { LegalConsentBanner } from "@/components/legal/legal-consent-banner";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";

type ClientProvidersProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

export function ClientProviders({
  children,
  initialUser = null,
}: ClientProvidersProps) {
  return (
    <AuthProvider initialUser={initialUser}>
      <SiteAmbientShell>
        {children}
      </SiteAmbientShell>
      <AuthModal />
      <ProcessModeModal />
      <ChequePrintMobileModal />
      <BuyTokensModal />
      <CreditsPurchaseModal />
      <LegalConsentBanner />
      <ScrollToTopButton />
    </AuthProvider>
  );
}

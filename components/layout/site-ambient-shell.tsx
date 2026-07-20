"use client";

import { usePathname } from "next/navigation";
import { SiteAmbientBackground } from "@/components/layout/ambient-cheque-background";

export function SiteAmbientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden">
        <SiteAmbientBackground />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

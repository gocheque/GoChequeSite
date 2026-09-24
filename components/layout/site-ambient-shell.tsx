"use client";

import { usePathname } from "next/navigation";

export function SiteAmbientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return <div className="marketing-shell relative isolate min-h-screen">{children}</div>;
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";

/** Resynchronise la session client après navigation (ex. accueil → tableau de bord). */
export function AuthSessionSync() {
  const { refreshSession } = useAuth();

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return null;
}

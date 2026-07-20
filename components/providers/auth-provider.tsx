"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requiresMfaChallenge } from "@/lib/auth/mfa-login";
import { getGuestId } from "@/lib/tokens/guest-id";
import { parseApiJson } from "@/lib/api/parse-json";

export type CheckoutMode = "guest" | "user";

type AuthContextValue = {
  user: User | null;
  tokenBalance: number | null;
  checkoutMode: CheckoutMode | null;
  guestId: string | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  refreshBalance: () => Promise<number | null>;
  refreshSession: () => Promise<User | null>;
  setAuthUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  startTraiterFlow: () => void;
  continueToPurchase: () => void;
  requestAuthForPurchase: () => void;
  backToProcessModal: () => void;
  closeProcessModal: () => void;
  traiterFlowActive: boolean;
  traiterCanReturnToProcess: boolean;
  showCreditsPurchased: (balance: number, added: number) => void;
  closeCreditsModal: () => void;
  tokensRevision: number;
  openAuthModal: () => void;
  openBuyTokensModal: () => void;
  authModalOpen: boolean;
  buyTokensModalOpen: boolean;
  processModeModalOpen: boolean;
  creditsModalOpen: boolean;
  lastCreditsAdded: number | null;
  pendingUserCheckout: boolean;
  setAuthModalOpen: (open: boolean) => void;
  cancelUserCheckout: () => void;
  setBuyTokensModalOpen: (open: boolean) => void;
  closeBuyTokensModal: () => void;
  setProcessModeModalOpen: (open: boolean) => void;
  setCreditsModalOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const signedOutRef = useRef(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [buyTokensModalOpen, setBuyTokensModalOpen] = useState(false);
  const [processModeModalOpen, setProcessModeModalOpen] = useState(false);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [lastCreditsAdded, setLastCreditsAdded] = useState<number | null>(null);
  const [pendingUserCheckout, setPendingUserCheckout] = useState(false);
  const [pendingTraiterAfterAuth, setPendingTraiterAfterAuth] = useState(false);
  const [traiterSkippedProcessModal, setTraiterSkippedProcessModal] =
    useState(false);
  const [traiterFlowActive, setTraiterFlowActive] = useState(false);
  const [tokensRevision, setTokensRevision] = useState(0);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  const setAuthUser = useCallback((authUser: User | null) => {
    signedOutRef.current = authUser === null;
    setUser(authUser);
    setIsLoading(false);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured()) return null;
    if (signedOutRef.current) {
      setUser(null);
      return null;
    }

    try {
      const supabase = getSupabase();
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (authUser) {
        if (await requiresMfaChallenge(supabase)) {
          setUser(null);
          return null;
        }

        signedOutRef.current = false;
        setUser(authUser);
        return authUser;
      }

      if (error) {
        setUser(null);
      }

      return null;
    } catch {
      return null;
    }
  }, [getSupabase]);

  const refreshBalance = useCallback(async (): Promise<number | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const res = await fetch("/api/tokens/balance");
      if (res.ok) {
        const data = await parseApiJson<{ balance?: number }>(res);
        const balance = data.balance ?? 0;
        setTokenBalance(balance);
        return balance;
      }

      if (res.status === 401) {
        setTokenBalance(null);
      }

      return null;
    } catch {
      setTokenBalance(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (signedOutRef.current) return;

    if (initialUser) {
      setUser(initialUser);
      setIsLoading(false);
      return;
    }

    if (initialUser === null) {
      setUser(null);
    }
  }, [initialUser]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      setIsSupabaseReady(false);
      return;
    }

    try {
      const supabase = getSupabase();
      setIsSupabaseReady(true);

      void refreshSession().finally(() => {
        setIsLoading(false);
      });

      const loadingTimeout = window.setTimeout(() => {
        setIsLoading(false);
      }, 4000);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          signedOutRef.current = true;
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (signedOutRef.current) {
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          void (async () => {
            if (await requiresMfaChallenge(supabase)) {
              setIsLoading(false);
              return;
            }

            signedOutRef.current = false;
            setUser(session.user);
            setIsLoading(false);
          })();
          return;
        }

        setIsLoading(false);
      });

      return () => {
        window.clearTimeout(loadingTimeout);
        subscription.unsubscribe();
      };
    } catch {
      setIsSupabaseReady(false);
      setIsLoading(false);
    }
  }, [getSupabase, refreshSession]);

  useEffect(() => {
    setGuestId(getGuestId());
  }, []);

  useEffect(() => {
    if (!isSupabaseReady) return;

    if (user) {
      refreshBalance();
      return;
    }

    if (checkoutMode === "guest" && guestId) {
      refreshBalance();
      return;
    }

    setTokenBalance(null);
  }, [user, guestId, checkoutMode, isSupabaseReady, refreshBalance]);

  useEffect(() => {
    if (user && pendingUserCheckout) {
      setPendingUserCheckout(false);
      setCheckoutMode("user");
      setBuyTokensModalOpen(true);
    }
  }, [user, pendingUserCheckout]);

  const proceedTraiterFlow = useCallback(async () => {
    setTraiterFlowActive(true);
    setCheckoutMode("user");

    try {
      let res = await fetch("/api/tokens/balance");

      if (res.status === 401) {
        const refreshed = await refreshSession();
        if (refreshed) {
          res = await fetch("/api/tokens/balance");
        }
      }

      const data = await parseApiJson<{ balance?: number }>(res);
      const balance = res.ok ? (data.balance ?? 0) : 0;
      const hasCredits = res.ok && balance > 0;

      if (hasCredits) {
        setTraiterSkippedProcessModal(false);
        setTokenBalance(balance);
        setProcessModeModalOpen(true);
        void refreshBalance();
        return;
      }

      setTraiterSkippedProcessModal(true);
      setBuyTokensModalOpen(true);
    } catch {
      setTraiterSkippedProcessModal(true);
      setBuyTokensModalOpen(true);
    }
  }, [refreshBalance, refreshSession]);

  useEffect(() => {
    if (user && pendingTraiterAfterAuth) {
      setPendingTraiterAfterAuth(false);
      void proceedTraiterFlow();
    }
  }, [user, pendingTraiterAfterAuth, proceedTraiterFlow]);

  const requestAuthForPurchase = useCallback(() => {
    if (user) {
      setCheckoutMode("user");
      setBuyTokensModalOpen(true);
      return;
    }

    setPendingUserCheckout(true);
    setAuthModalOpen(true);
  }, [user]);

  const signOut = useCallback(async () => {
    signedOutRef.current = true;
    setUser(null);
    setTokenBalance(null);
    setCheckoutMode(null);

    if (!isSupabaseConfigured()) return;

    const { error } = await getSupabase().auth.signOut();
    if (error) {
      console.error("[signOut]", error);
    }
  }, [getSupabase]);

  const startTraiterFlow = useCallback(async () => {
    const currentUser = user ?? (await refreshSession());

    if (currentUser) {
      void proceedTraiterFlow();
      return;
    }

    setTraiterFlowActive(true);
    setPendingTraiterAfterAuth(true);
    setAuthModalOpen(true);
  }, [user, proceedTraiterFlow, refreshSession]);

  const backToProcessModal = useCallback(() => {
    setBuyTokensModalOpen(false);
    setAuthModalOpen(false);
    setPendingUserCheckout(false);

    if (traiterSkippedProcessModal) {
      setTraiterSkippedProcessModal(false);
      setTraiterFlowActive(false);
      return;
    }

    void refreshBalance();
    setProcessModeModalOpen(true);
  }, [traiterSkippedProcessModal, refreshBalance]);

  const closeBuyTokensModal = useCallback(() => {
    setBuyTokensModalOpen(false);

    if (traiterSkippedProcessModal) {
      setTraiterSkippedProcessModal(false);
      setTraiterFlowActive(false);
    }
  }, [traiterSkippedProcessModal]);

  const closeProcessModal = useCallback(() => {
    setProcessModeModalOpen(false);
    setTraiterFlowActive(false);
    setTraiterSkippedProcessModal(false);
    setPendingUserCheckout(false);
  }, []);

  const continueToPurchase = useCallback(() => {
    setProcessModeModalOpen(false);
    setTraiterSkippedProcessModal(false);

    if (user) {
      setCheckoutMode("user");
      setBuyTokensModalOpen(true);
      return;
    }

    setPendingUserCheckout(true);
    setTraiterFlowActive(true);
    setAuthModalOpen(true);
  }, [user]);

  const showCreditsPurchased = useCallback(
    (balance: number, added: number) => {
      setLastCreditsAdded(added);
      setCreditsModalOpen(true);
      setTraiterFlowActive(false);
      setTokenBalance(balance);
      setTokensRevision((n) => n + 1);
    },
    [],
  );

  const closeCreditsModal = useCallback(() => {
    setCreditsModalOpen(false);
    setLastCreditsAdded(null);
    void refreshBalance();
    setTokensRevision((n) => n + 1);
  }, [refreshBalance]);

  const cancelUserCheckout = useCallback(() => {
    setPendingUserCheckout(false);
    setAuthModalOpen(false);

    if (pendingTraiterAfterAuth) {
      setPendingTraiterAfterAuth(false);
      setTraiterFlowActive(false);
      return;
    }

    if (traiterFlowActive) {
      void refreshBalance();
      setProcessModeModalOpen(true);
    }
  }, [traiterFlowActive, pendingTraiterAfterAuth, refreshBalance]);

  const value: AuthContextValue = {
    user,
    tokenBalance,
    checkoutMode,
    guestId,
    isLoading,
    isSupabaseReady,
    refreshBalance,
    refreshSession,
    setAuthUser,
    signOut,
    startTraiterFlow,
    continueToPurchase,
    requestAuthForPurchase,
    backToProcessModal,
    closeBuyTokensModal,
    closeProcessModal,
    traiterFlowActive,
    traiterCanReturnToProcess: traiterFlowActive && !traiterSkippedProcessModal,
    showCreditsPurchased,
    closeCreditsModal,
    tokensRevision,
    openAuthModal: () => {
      setTraiterFlowActive(false);
      setAuthModalOpen(true);
    },
    openBuyTokensModal: () => {
      if (!user) {
        setPendingUserCheckout(true);
        setAuthModalOpen(true);
        return;
      }

      setTraiterFlowActive(false);
      setCheckoutMode("user");
      setBuyTokensModalOpen(true);
    },
    authModalOpen,
    buyTokensModalOpen,
    processModeModalOpen,
    creditsModalOpen,
    lastCreditsAdded,
    pendingUserCheckout,
    setAuthModalOpen,
    cancelUserCheckout,
    setBuyTokensModalOpen,
    setProcessModeModalOpen,
    setCreditsModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

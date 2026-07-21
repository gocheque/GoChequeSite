"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { PasswordStrengthChecker } from "@/components/auth/password-strength-checker";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import {
  getPasswordStrength,
  isValidPseudo,
} from "@/lib/auth/password-strength";
import {
  cancelTotpEnrollment,
  enrollTotpFactor,
  getVerifiedTotpFactorId,
  requiresMfaChallenge,
  verifyTotpFactor,
} from "@/lib/auth/mfa-login";

type AuthStep = "form" | "login-mfa" | "signup-mfa-offer" | "signup-mfa-enroll";

type MfaEnrollState = {
  factorId: string;
  qrCode: string;
};

function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthModal() {
  const router = useRouter();
  const { t, path } = useLocale();
  const {
    authModalOpen,
    setAuthModalOpen,
    cancelUserCheckout,
    pendingUserCheckout,
    traiterFlowActive,
    setAuthUser,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<AuthStep>("form");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaEnroll, setMfaEnroll] = useState<MfaEnrollState | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  if (!authModalOpen) return null;

  function resetAuthFlow() {
    setAuthStep("form");
    setPendingUser(null);
    setMfaFactorId(null);
    setMfaEnroll(null);
    setMfaCode("");
    setError(null);
  }

  async function resetLoginMfaChallenge() {
    setMfaFactorId(null);
    setMfaCode("");
    setError(null);
    setAuthStep("form");

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore — partial MFA session cleanup
    }
  }

  async function cancelSignupMfaEnroll() {
    if (mfaEnroll) {
      const supabase = createClient();
      await cancelTotpEnrollment(supabase, mfaEnroll.factorId);
    }

    setMfaEnroll(null);
    setMfaCode("");
    setError(null);
    setAuthStep("signup-mfa-offer");
  }

  function closeModal() {
    if (authStep === "login-mfa") {
      void resetLoginMfaChallenge();
      return;
    }

    if (pendingUser) {
      if (authStep === "signup-mfa-enroll" && mfaEnroll) {
        void cancelTotpEnrollment(createClient(), mfaEnroll.factorId);
      }
      finishLogin(pendingUser);
      return;
    }

    cancelUserCheckout();
    setEmail("");
    setPseudo("");
    setPassword("");
    setAcceptedLegal(false);
    resetAuthFlow();
    setSuccess(null);
  }

  function finishLogin(user: User) {
    setAuthUser(user);
    setAuthModalOpen(false);
    setEmail("");
    setPassword("");
    setPseudo("");
    resetAuthFlow();
    router.refresh();

    if (!pendingUserCheckout && !traiterFlowActive) {
      router.push(path("/dashboard"));
    }
  }

  function switchMode(next: "login" | "signup") {
    if (authStep !== "form") return;
    setMode(next);
    setPseudo("");
    setPassword("");
    setError(null);
    setSuccess(null);
    setAcceptedLegal(false);
  }

  const passwordStrength = getPasswordStrength(password);
  const canSignUp =
    isValidPseudo(pseudo) &&
    passwordStrength.isStrong &&
    email.trim().length > 0 &&
    acceptedLegal;

  async function handleMfaVerify(e: React.FormEvent) {
    e.preventDefault();
    const factorId = authStep === "signup-mfa-enroll" ? mfaEnroll?.factorId : mfaFactorId;
    if (!factorId || mfaCode.trim().length < 6) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: verifyError } = await verifyTotpFactor(
      supabase,
      factorId,
      mfaCode,
    );

    setLoading(false);

    if (verifyError) {
      setError(
        verifyError.message.includes("Invalid")
          ? t("auth.mfaLoginFailed")
          : verifyError.message,
      );
      return;
    }

    const user = data.user ?? pendingUser;
    if (!user) {
      setError(t("auth.loginFailed"));
      return;
    }

    finishLogin(user);
  }

  async function startSignupMfaEnroll() {
    if (!pendingUser) return;

    setLoading(true);
    setError(null);
    setMfaCode("");

    try {
      const supabase = createClient();
      const enroll = await enrollTotpFactor(supabase);
      setMfaEnroll(enroll);
      setAuthStep("signup-mfa-enroll");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("account.mfaEnrollFailed"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();

    if (mode === "login") {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (authError) {
        setError(
          authError.message.includes("Email not confirmed")
            ? t("auth.confirmEmail")
            : authError.message === "Invalid login credentials"
              ? t("auth.invalidCredentials")
              : authError.message,
        );
        return;
      }

      if (!data.session?.user) {
        setError(t("auth.loginFailed"));
        return;
      }

      const needsMfa = await requiresMfaChallenge(supabase);
      if (needsMfa) {
        const factorId = await getVerifiedTotpFactorId(supabase);
        if (!factorId) {
          setError(t("auth.loginFailed"));
          return;
        }

        setMfaFactorId(factorId);
        setAuthStep("login-mfa");
        setPassword("");
        return;
      }

      finishLogin(data.session.user);
      return;
    }

    if (!isValidPseudo(pseudo)) {
      setLoading(false);
      setError(t("auth.pseudoHint"));
      return;
    }

    if (!passwordStrength.isStrong) {
      setLoading(false);
      setError(t("auth.weakPassword"));
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(path("/dashboard"))}`,
        data: {
          pseudo: pseudo.trim(),
          display_name: pseudo.trim(),
        },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (data.session?.user) {
      setAuthUser(data.session.user);
      setPendingUser(data.session.user);
      setPseudo("");
      setPassword("");
      setAuthStep("signup-mfa-offer");
      return;
    }

    setSuccess(t("auth.signupSuccess"));
    setMode("login");
    setPseudo("");
    setPassword("");
  }

  async function handleGoogleAuth() {
    if (mode === "signup" && !acceptedLegal) {
      setError(t("auth.signupLegalRequired"));
      document.getElementById("auth-signup-legal")?.focus();
      document
        .getElementById("auth-signup-legal-box")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const next = encodeURIComponent(path("/dashboard"));
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.googleError"));
      setLoading(false);
    }
  }

  const subtitle =
    authStep === "login-mfa" || authStep === "signup-mfa-enroll"
      ? t("auth.mfaLoginSubtitle")
      : authStep === "signup-mfa-offer"
        ? t("auth.mfaSignupOfferSubtitle")
        : pendingUserCheckout
          ? t("auth.checkoutSubtitle")
          : traiterFlowActive
            ? t("auth.traiterSubtitle")
            : mode === "login"
              ? t("auth.loginSubtitle")
              : t("auth.signupSubtitle");

  const title =
    authStep === "login-mfa" || authStep === "signup-mfa-enroll"
      ? t("auth.mfaLoginTitle")
      : authStep === "signup-mfa-offer"
        ? t("auth.mfaSignupOfferTitle")
        : mode === "login"
          ? t("auth.loginTitle")
          : t("auth.signupTitle");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 pb-5 pt-6">
          {(pendingUserCheckout || traiterFlowActive) && (
            <button
              type="button"
              onClick={closeModal}
              className="absolute left-5 top-5 text-sm font-semibold text-slate-500 transition hover:text-[#ff6633]"
            >
              {t("auth.back")}
            </button>
          )}

          <ModalCloseButton onClick={closeModal} className="absolute right-4 top-4" />

          <h2 className="text-center text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>

          {authStep === "form" && (
            <div className="mt-5 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t("auth.loginTitle")}
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t("auth.signupTab")}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6 px-6 py-6">
          {authStep === "signup-mfa-offer" && pendingUser ? (
            <div className="space-y-3">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  void startSignupMfaEnroll();
                }}
                className="w-full rounded-lg bg-[#ff6633] py-3 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t("auth.loading") : t("auth.mfaSignupEnable")}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => finishLogin(pendingUser)}
                className="w-full rounded-lg border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {t("auth.mfaSignupSkip")}
              </button>
            </div>
          ) : authStep === "login-mfa" || authStep === "signup-mfa-enroll" ? (
            <form onSubmit={handleMfaVerify} className="space-y-3">
              {authStep === "signup-mfa-enroll" && mfaEnroll && (
                <>
                  <p className="text-sm text-slate-600">{t("account.mfaScanQr")}</p>
                  <div className="mx-auto w-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mfaEnroll.qrCode}
                      alt=""
                      width={160}
                      height={160}
                      className="h-40 w-40"
                    />
                  </div>
                </>
              )}

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                placeholder={t("account.mfaEnterCode")}
                value={mfaCode}
                onChange={(e) =>
                  setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center text-lg tracking-[0.35em] focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
              />

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || mfaCode.length < 6}
                className="w-full rounded-lg bg-[#ff6633] py-3 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t("auth.loading") : t("auth.mfaLoginVerify")}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (authStep === "signup-mfa-enroll") {
                    void cancelSignupMfaEnroll();
                    return;
                  }
                  void resetLoginMfaChallenge();
                }}
                className="w-full rounded-lg border border-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {t("auth.back")}
              </button>
            </form>
          ) : (
            <>
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === "signup" && (
              <div>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]+"
                  placeholder={t("auth.pseudo")}
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
                />
                {pseudo.length > 0 && !isValidPseudo(pseudo) && (
                  <p className="mt-1.5 text-xs text-red-600">{t("auth.pseudoHint")}</p>
                )}
              </div>
            )}

            <input
              type="email"
              required
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete={mode === "signup" ? "email" : "username"}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
            />
            <input
              type="password"
              required
              minLength={mode === "signup" ? 8 : 6}
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20"
            />

            {mode === "signup" && <PasswordStrengthChecker password={password} />}

            {mode === "signup" && (
              <label
                id="auth-signup-legal-box"
                className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-slate-50/80 px-3 py-3 ${
                  error === t("auth.signupLegalRequired")
                    ? "border-red-400"
                    : "border-slate-200"
                }`}
              >
                <input
                  id="auth-signup-legal"
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => {
                    setAcceptedLegal(e.target.checked);
                    if (e.target.checked) setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#ff6633] focus:ring-[#ff6633]/20"
                />
                <span className="text-xs leading-relaxed text-slate-600">
                  {t("auth.signupLegalBefore")}{" "}
                  <Link
                    href={path("/terms")}
                    className="font-semibold text-[#ff6633] underline-offset-2 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("footer.terms")}
                  </Link>{" "}
                  {t("auth.signupLegalMiddle")}{" "}
                  <Link
                    href={path("/privacy")}
                    className="font-semibold text-[#ff6633] underline-offset-2 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("footer.privacy")}
                  </Link>
                  .
                </span>
              </label>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (mode === "signup" && !canSignUp)}
              className="w-full rounded-lg bg-[#ff6633] py-3 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? t("auth.loading")
                : mode === "login"
                  ? t("auth.login")
                  : t("auth.signup")}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">{t("common.or")}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              void handleGoogleAuth();
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            {t("auth.google")}
          </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Factor } from "@supabase/supabase-js";
import {
  ChevronDown,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PasswordStrengthChecker } from "@/components/auth/password-strength-checker";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { getDisplayName } from "@/lib/auth/display-name";
import {
  getPasswordStrength,
  isValidPseudo,
} from "@/lib/auth/password-strength";

type SectionId = "profile" | "password" | "security";

type MfaEnrollState = {
  factorId: string;
  qrCode: string;
};

const SECTIONS: {
  id: SectionId;
  icon: typeof UserRound;
}[] = [
  { id: "profile", icon: UserRound },
  { id: "password", icon: Lock },
  { id: "security", icon: ShieldCheck },
];

function sectionTitle(id: SectionId, t: (key: string) => string) {
  if (id === "profile") return t("account.profileTitle");
  if (id === "password") return t("account.changePassword");
  return t("account.securityTitle");
}

function sectionDescription(id: SectionId, t: (key: string) => string) {
  if (id === "profile") return t("account.profileDescription");
  if (id === "password") return t("account.passwordDescription");
  return t("account.securityDescription");
}

function inputClassName() {
  return "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition focus:border-[#ff6633] focus:outline-none focus:ring-2 focus:ring-[#ff6633]/20";
}

function Alert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p
      className={`rounded-xl px-4 py-3 text-sm ${
        tone === "error"
          ? "bg-red-50 text-red-600"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {children}
    </p>
  );
}

export function AccountSettingsForm() {
  const { t } = useLocale();
  const { user, refreshSession } = useAuth();

  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    () => new Set(),
  );

  const [pseudo, setPseudo] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [mfaLoading, setMfaLoading] = useState(true);
  const [mfaFactor, setMfaFactor] = useState<Factor | null>(null);
  const [mfaEnroll, setMfaEnroll] = useState<MfaEnrollState | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaSuccess, setMfaSuccess] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);
  const canSavePassword =
    currentPassword.length > 0 &&
    passwordStrength.isStrong &&
    password === confirmPassword &&
    confirmPassword.length > 0;
  const canSaveProfile = isValidPseudo(pseudo);

  const displayName = user
    ? getDisplayName(user, t("auth.pseudo"))
    : "";
  const emailInitial = (displayName[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  useEffect(() => {
    if (!user) return;
    const currentPseudo = getDisplayName(user, "");
    setPseudo(currentPseudo);
  }, [user]);

  const loadMfaFactors = useCallback(async () => {
    setMfaLoading(true);
    setMfaError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) throw error;

      const verifiedTotp =
        data.totp.find((factor) => factor.status === "verified") ?? null;
      setMfaFactor(verifiedTotp);
    } catch {
      setMfaFactor(null);
    } finally {
      setMfaLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMfaFactors();
  }, [loadMfaFactors]);

  function toggleSection(id: SectionId) {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSaveProfile) return;

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const trimmed = pseudo.trim();
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { pseudo: trimmed, display_name: trimmed },
      });

      if (error) throw error;

      await refreshSession();
      setProfileSuccess(t("account.profileUpdated"));
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : t("account.profileUpdateFailed"),
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSavePassword || !user?.email) return;

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const supabase = createClient();

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error(t("account.currentPasswordInvalid"));
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setPasswordSuccess(t("account.passwordUpdated"));
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : t("account.passwordUpdateFailed"),
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function startMfaEnroll() {
    setMfaBusy(true);
    setMfaError(null);
    setMfaSuccess(null);
    setMfaCode("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator",
      });

      if (error) throw error;

      setMfaEnroll({
        factorId: data.id,
        qrCode: data.totp.qr_code,
      });
      setOpenSections((current) => new Set(current).add("security"));
    } catch (err) {
      setMfaError(
        err instanceof Error ? err.message : t("account.mfaEnrollFailed"),
      );
    } finally {
      setMfaBusy(false);
    }
  }

  function cancelMfaEnroll() {
    if (mfaEnroll) {
      void createClient()
        .auth.mfa.unenroll({ factorId: mfaEnroll.factorId })
        .catch(() => undefined);
    }
    setMfaEnroll(null);
    setMfaCode("");
    setMfaError(null);
  }

  async function verifyMfaEnroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mfaEnroll || mfaCode.trim().length < 6) return;

    setMfaBusy(true);
    setMfaError(null);
    setMfaSuccess(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaEnroll.factorId,
        code: mfaCode.trim(),
      });

      if (error) throw error;

      setMfaEnroll(null);
      setMfaCode("");
      setMfaSuccess(t("account.mfaEnabledSuccess"));
      await loadMfaFactors();
    } catch (err) {
      setMfaError(
        err instanceof Error ? err.message : t("account.mfaVerifyFailed"),
      );
    } finally {
      setMfaBusy(false);
    }
  }

  async function disableMfa() {
    if (!mfaFactor) return;

    setMfaBusy(true);
    setMfaError(null);
    setMfaSuccess(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: mfaFactor.id,
      });

      if (error) throw error;

      setMfaFactor(null);
      setMfaSuccess(t("account.mfaDisabledSuccess"));
      await loadMfaFactors();
    } catch (err) {
      setMfaError(
        err instanceof Error ? err.message : t("account.mfaDisableFailed"),
      );
    } finally {
      setMfaBusy(false);
    }
  }

  function renderSectionContent(id: SectionId) {
    if (id === "profile") {
      return (
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff6633]/10 text-lg font-bold text-[#ff6633]">
              {emailInitial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="account-username"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {t("auth.pseudo")}
            </label>
            <input
              id="account-username"
              type="text"
              autoComplete="username"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className={inputClassName()}
            />
            {pseudo.length > 0 && !isValidPseudo(pseudo) && (
              <p className="mt-1.5 text-xs text-red-600">{t("auth.pseudoHint")}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="account-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {t("auth.email")}
            </label>
            <input
              id="account-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              className={`${inputClassName()} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          {profileError && <Alert tone="error">{profileError}</Alert>}
          {profileSuccess && <Alert tone="success">{profileSuccess}</Alert>}

          <button
            type="submit"
            disabled={!canSaveProfile || profileLoading}
            className="inline-flex items-center justify-center rounded-xl bg-[#ff6633] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {profileLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t("account.saveProfile")
            )}
          </button>
        </form>
      );
    }

    if (id === "password") {
      return (
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="current-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {t("account.currentPassword")}
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClassName()}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {t("account.newPassword")}
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClassName()}
              />
              {password.length > 0 && (
                <div className="mt-3">
                  <PasswordStrengthChecker password={password} />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {t("account.confirmPassword")}
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClassName()}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {t("account.passwordMismatch")}
                </p>
              )}
            </div>
          </div>

          {passwordError && <Alert tone="error">{passwordError}</Alert>}
          {passwordSuccess && <Alert tone="success">{passwordSuccess}</Alert>}

          <button
            type="submit"
            disabled={!canSavePassword || passwordLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {passwordLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                {t("account.savePassword")}
              </>
            )}
          </button>
        </form>
      );
    }

    return (
      <div className="space-y-5">
        {mfaLoading ? (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("account.mfaLoading")}
          </p>
        ) : mfaEnroll ? (
          <form onSubmit={verifyMfaEnroll} className="space-y-5">
            <p className="text-sm text-slate-600">{t("account.mfaScanQr")}</p>
            <div className="mx-auto w-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mfaEnroll.qrCode}
                alt=""
                width={180}
                height={180}
                className="h-44 w-44"
              />
            </div>
            <div>
              <label
                htmlFor="mfa-code"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {t("account.mfaEnterCode")}
              </label>
              <input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={mfaCode}
                onChange={(e) =>
                  setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className={`${inputClassName()} max-w-xs tracking-[0.3em]`}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={mfaBusy || mfaCode.length < 6}
                className="inline-flex items-center justify-center rounded-xl bg-[#ff6633] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mfaBusy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t("account.mfaVerify")
                )}
              </button>
              <button
                type="button"
                onClick={cancelMfaEnroll}
                disabled={mfaBusy}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {t("account.mfaCancel")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    mfaFactor ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span className="text-sm font-medium text-slate-800">
                  {mfaFactor
                    ? t("account.mfaStatusEnabled")
                    : t("account.mfaStatusDisabled")}
                </span>
              </div>
              {mfaFactor ? (
                <button
                  type="button"
                  onClick={() => void disableMfa()}
                  disabled={mfaBusy}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {mfaBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("account.mfaDisable")
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void startMfaEnroll()}
                  disabled={mfaBusy}
                  className="rounded-lg bg-[#ff6633] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e05526] disabled:opacity-50"
                >
                  {mfaBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("account.mfaEnable")
                  )}
                </button>
              )}
            </div>
          </>
        )}

        {mfaError && <Alert tone="error">{mfaError}</Alert>}
        {mfaSuccess && <Alert tone="success">{mfaSuccess}</Alert>}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t("account.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t("account.subtitle")}</p>
        </div>
        {openSections.size > 0 && (
          <button
            type="button"
            onClick={collapseAll}
            className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {t("account.collapseAll")}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {SECTIONS.map(({ id, icon: Icon }) => {
          const isOpen = openSections.has(id);

          return (
            <section
              key={id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                isOpen
                  ? "border-[#ff6633]/40 ring-2 ring-[#ff6633]/10"
                  : "border-slate-200/80"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(id)}
                aria-expanded={isOpen}
                aria-controls={`account-panel-${id}`}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff6633]/10 text-[#ff6633]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 sm:text-base">
                    {sectionTitle(id, t)}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 sm:text-sm">
                    {sectionDescription(id, t)}
                  </span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#ff6633] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`account-panel-${id}`}
                  className="border-t border-slate-100 px-5 py-5 sm:px-6 sm:py-6"
                >
                  {renderSectionContent(id)}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

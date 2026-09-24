"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordStrengthChecker } from "@/components/auth/password-strength-checker";
import { useLocale } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";
import { getPasswordStrength } from "@/lib/auth/password-strength";

export function ResetPasswordForm() {
  const router = useRouter();
  const { t, path, locale } = useLocale();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);
  const canSave =
    passwordStrength.isStrong &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!cancelled) {
          setHasSession(Boolean(user));
          setEmail(user?.email ?? "");
        }
      } catch {
        if (!cancelled) setHasSession(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSave) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;

      await fetch("/api/email/password-changed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      }).catch(() => undefined);

      setSuccess(t("auth.resetSuccess"));
      router.push(path("/dashboard"));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("account.passwordUpdateFailed"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(path("/auth/reset-password"))}`,
        },
      );
      if (resetError) throw resetError;
      setSuccess(t("auth.forgotSuccess"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <p className="text-center text-sm text-[#5b6b7c]">{t("auth.loading")}</p>
    );
  }

  if (!hasSession) {
    return (
      <form onSubmit={handleRequestLink} className="space-y-4">
        <p className="text-sm leading-relaxed text-[#5b6b7c]">
          {t("auth.resetExpired")}
        </p>
        <input
          type="email"
          required
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full rounded-md border border-[#e7e4de] bg-white px-4 py-3 text-sm text-[#0b1f33] focus:border-[#0b1f33] focus:outline-none focus:ring-2 focus:ring-[#0b1f33]/10"
        />
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || email.trim().length === 0}
          className="w-full rounded-md bg-[#0b1f33] py-3 text-sm font-semibold text-white transition hover:bg-[#16324c] disabled:opacity-50"
        >
          {loading ? t("auth.loading") : t("auth.resetRequestNew")}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <input
        type="password"
        required
        minLength={8}
        placeholder={t("account.newPassword")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full rounded-md border border-[#e7e4de] bg-white px-4 py-3 text-sm text-[#0b1f33] focus:border-[#0b1f33] focus:outline-none focus:ring-2 focus:ring-[#0b1f33]/10"
      />
      <input
        type="password"
        required
        minLength={8}
        placeholder={t("account.confirmPassword")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full rounded-md border border-[#e7e4de] bg-white px-4 py-3 text-sm text-[#0b1f33] focus:border-[#0b1f33] focus:outline-none focus:ring-2 focus:ring-[#0b1f33]/10"
      />
      <PasswordStrengthChecker password={password} />
      {password.length > 0 &&
        confirmPassword.length > 0 &&
        password !== confirmPassword && (
          <p className="text-sm text-red-600">{t("account.passwordMismatch")}</p>
        )}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !canSave}
        className="w-full rounded-md bg-[#0b1f33] py-3 text-sm font-semibold text-white transition hover:bg-[#16324c] disabled:opacity-50"
      >
        {loading ? t("auth.loading") : t("auth.resetSubmit")}
      </button>
    </form>
  );
}

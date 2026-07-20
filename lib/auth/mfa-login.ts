import type { SupabaseClient } from "@supabase/supabase-js";

export async function requiresMfaChallenge(supabase: SupabaseClient) {
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error || !data) return false;

  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

export async function getVerifiedTotpFactorId(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) return null;

  return (
    data.totp.find((factor) => factor.status === "verified")?.id ?? null
  );
}

export async function enrollTotpFactor(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Authenticator",
  });

  if (error) throw error;

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
  };
}

export async function verifyTotpFactor(
  supabase: SupabaseClient,
  factorId: string,
  code: string,
) {
  return supabase.auth.mfa.challengeAndVerify({
    factorId,
    code: code.trim(),
  });
}

export async function cancelTotpEnrollment(
  supabase: SupabaseClient,
  factorId: string,
) {
  await supabase.auth.mfa.unenroll({ factorId }).catch(() => undefined);
}

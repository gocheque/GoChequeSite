export function getDisplayName(
  user: { email?: string; user_metadata?: Record<string, unknown> },
  fallback: string,
) {
  const meta = user.user_metadata ?? {};
  const pseudo = meta.pseudo ?? meta.display_name;
  if (typeof pseudo === "string" && pseudo.trim()) return pseudo.trim();
  if (user.email) return user.email.split("@")[0];
  return fallback;
}

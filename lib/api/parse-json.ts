export async function parseApiJson<T = Record<string, unknown>>(
  res: Response,
): Promise<T> {
  const text = await res.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.ok
        ? "Réponse du serveur invalide"
        : "Une erreur est survenue. Réessayez.",
    );
  }
}

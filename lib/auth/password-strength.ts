export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "Au moins 8 caractères",
    test: (p) => p.length >= 8,
  },
  {
    id: "upper",
    label: "Une lettre majuscule",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "Une lettre minuscule",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "digit",
    label: "Un chiffre",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "Un caractère spécial (!@#$%...)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export function getPasswordStrength(password: string) {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));

  const passedCount = results.filter((r) => r.passed).length;
  const score = Math.round((passedCount / PASSWORD_RULES.length) * 100);
  const isStrong = passedCount === PASSWORD_RULES.length;

  return { results, score, isStrong };
}

export function isValidPseudo(pseudo: string) {
  const trimmed = pseudo.trim();
  return /^[a-zA-Z0-9_-]{3,20}$/.test(trimmed);
}

export const PSEUDO_HINT =
  "3 à 20 caractères : lettres, chiffres, tiret ou souligné.";

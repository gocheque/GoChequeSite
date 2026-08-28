import type { Locale } from "@/lib/i18n/config";

type Copy = {
  preheader: string;
  heading: string;
  paragraphs: string[];
  cta: string;
  footer: string;
  ignore: string;
};

export type WelcomeCopyInput = {
  siteUrl: string;
  dashboardUrl: string;
};

export type ReceiptCopyInput = {
  packageName: string;
  creditsAdded: number;
  balance: number;
  amountLabel: string;
  dashboardUrl: string;
};

export function welcomeCopy(locale: Locale, input: WelcomeCopyInput): Copy {
  if (locale === "en") {
    return {
      preheader: "Your GoCheque account is ready.",
      heading: "Welcome to GoCheque",
      paragraphs: [
        "Your account is confirmed. You can now fill, print and process Canadian cheques for mobile deposit.",
        "Credits you buy are stored on your account. Printing a cheque uses one credit.",
      ],
      cta: "Open my dashboard",
      footer: `GoCheque · ${input.siteUrl}`,
      ignore: "",
    };
  }

  return {
    preheader: "Votre compte GoCheque est prêt.",
    heading: "Bienvenue sur GoCheque",
    paragraphs: [
      "Votre compte est confirmé. Vous pouvez maintenant remplir, imprimer et traiter des chèques canadiens pour le dépôt mobile.",
      "Les crédits achetés sont conservés sur votre compte. Imprimer un chèque utilise un crédit.",
    ],
    cta: "Ouvrir mon tableau de bord",
    footer: `GoCheque · ${input.siteUrl}`,
    ignore: "",
  };
}

export function receiptCopy(locale: Locale, input: ReceiptCopyInput): Copy {
  if (locale === "en") {
    return {
      preheader: `Receipt: ${input.creditsAdded} print credit${input.creditsAdded === 1 ? "" : "s"} added.`,
      heading: "Payment received",
      paragraphs: [
        `Thank you. We added ${input.creditsAdded} print credit${input.creditsAdded === 1 ? "" : "s"} (${input.packageName}) to your GoCheque account.`,
        `Amount charged: ${input.amountLabel}. New balance: ${input.balance}.`,
        "A Stripe invoice is also available from your dashboard if you need a tax receipt.",
      ],
      cta: "View my credits",
      footer: "GoCheque · Canadian bank cheques, ready to print",
      ignore: "",
    };
  }

  return {
    preheader: `Reçu : ${input.creditsAdded} crédit${input.creditsAdded === 1 ? "" : "s"} d’impression ajouté${input.creditsAdded === 1 ? "" : "s"}.`,
    heading: "Paiement reçu",
    paragraphs: [
      `Merci. Nous avons ajouté ${input.creditsAdded} crédit${input.creditsAdded === 1 ? "" : "s"} d’impression (${input.packageName}) à votre compte GoCheque.`,
      `Montant débité : ${input.amountLabel}. Nouveau solde : ${input.balance}.`,
      "Une facture Stripe est aussi disponible depuis votre tableau de bord si vous avez besoin d’un reçu fiscal.",
    ],
    cta: "Voir mes crédits",
    footer: "GoCheque · Chèques bancaires canadiens, prêts à imprimer",
    ignore: "",
  };
}

export function paymentFailedCopy(locale: Locale): Copy {
  if (locale === "en") {
    return {
      preheader: "Your GoCheque payment did not go through.",
      heading: "Payment not completed",
      paragraphs: [
        "We could not add print credits because the payment did not complete.",
        "No credits were added. You can try again from your dashboard — you will not be charged twice for a failed attempt.",
      ],
      cta: "Try again",
      footer: "GoCheque · Canadian bank cheques, ready to print",
      ignore: "If you did not try to buy credits, you can ignore this message.",
    };
  }

  return {
    preheader: "Votre paiement GoCheque n’a pas abouti.",
    heading: "Paiement non complété",
    paragraphs: [
      "Nous n’avons pas pu ajouter de crédits d’impression, car le paiement n’a pas été complété.",
      "Aucun crédit n’a été ajouté. Vous pouvez réessayer depuis votre tableau de bord — un essai échoué n’est pas débité deux fois.",
    ],
    cta: "Réessayer",
    footer: "GoCheque · Chèques bancaires canadiens, prêts à imprimer",
    ignore: "Si vous n’avez pas tenté d’acheter des crédits, ignorez ce message.",
  };
}

export function passwordChangedCopy(locale: Locale, siteUrl: string): Copy {
  if (locale === "en") {
    return {
      preheader: "Your GoCheque password was changed.",
      heading: "Password updated",
      paragraphs: [
        "The password on your GoCheque account was just changed.",
        "If you made this change, no further action is needed.",
      ],
      cta: "Open my account",
      footer: `GoCheque · ${siteUrl}`,
      ignore:
        "If you did not change your password, reset it immediately and contact info@gocheque.ca.",
    };
  }

  return {
    preheader: "Votre mot de passe GoCheque a été modifié.",
    heading: "Mot de passe mis à jour",
    paragraphs: [
      "Le mot de passe de votre compte GoCheque vient d’être modifié.",
      "Si vous êtes à l’origine de ce changement, aucune action n’est requise.",
    ],
    cta: "Ouvrir mon compte",
    footer: `GoCheque · ${siteUrl}`,
    ignore:
      "Si vous n’avez pas changé votre mot de passe, réinitialisez-le immédiatement et écrivez à info@gocheque.ca.",
  };
}

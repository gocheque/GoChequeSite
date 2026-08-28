import { privacyFr, termsFr } from "@/lib/legal/copy-fr";

export const dictionary = {
  meta: {
    homeTitle: "GoCheque — Chèques bancaires canadiens, prêts à imprimer",
    homeDescription:
      "Générez et imprimez des chèques bancaires canadiens conformes CPA 006 pour le dépôt mobile — non destinés au dépôt en succursale.",
    dashboardTitle: "Tableau de bord",
    dashboardDescription: "Gérez vos crédits d'impression GoCheque.",
  },
  nav: {
    editor: "Aperçu",
    preview: "Aperçu",
    features: "Avantages",
    pricing: "Tarifs",
    faq: "FAQ",
    dashboard: "Tableau de bord",
    signIn: "Connexion",
    signOut: "Déconnexion",
    myAccount: "Mon compte",
    myCredits: "Mes crédits",
    editorDashboard: "Éditeur",
    accountSection: "Compte",
    accountMenu: "Menu compte",
    main: "Navigation principale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    skipToContent: "Aller au contenu",
    logoAlt: "GoCheque — Chèques bancaires canadiens, prêts à imprimer",
  },
  locale: {
    switchToFr: "Français",
    switchToEn: "English",
    label: "Langue",
  },
  hero: {
    logoAlt: "GoCheque — Chèques bancaires canadiens, prêts à imprimer",
    titleBefore: "Chèques bancaires",
    titleHighlight: "canadiens",
    titleAfter: "Prêts à imprimer",
    subtitle:
      "Aucun papier spécial, aucune encre particulière, aucun logiciel compliqué.",
    depositNoticeLead: "Dépôt mobile uniquement.",
    depositNoticeRest: "Non destiné au dépôt en succursale.",
    ctaTry: "Essayez maintenant",
    ctaPricing: "Voir les tarifs",
  },
  gallery: {
    sectionLabel: "Aperçu du produit",
    label: "Découvrez l'éditeur GoCheque",
    items: {
      editor: "Éditeur de chèque",
      preview: "Aperçu en temps réel",
      print: "Impression CPA 006",
      dashboard: "Tableau de bord",
    },
  },
  showcase: {
    sectionLabel: "Parcours GoCheque",
    eyebrow: "Voici les étapes pour compléter un chèque",
    steps: [
      {
        word: "Remplir",
        description: "Remplir vos infos bancaires",
      },
      {
        word: "Imprimer",
        description: "Imprimer sur papier ordinaire",
      },
      {
        word: "Signer",
        description: "Signer votre chèque",
      },
      {
        word: "Envoyer",
        description: "Envoyer via dépôt mobile",
      },
    ],
  },
  editor: {
    sectionLabel: "Éditeur de chèque",
    formTitle: "Modifier le chèque",
    clear: "Effacer",
    clearAriaLabel: "Effacer le chèque et recommencer la saisie",
    autofillNote:
      "Votre navigateur peut proposer d'enregistrer ces informations localement (comme une adresse ou une carte). GoCheque ne les stocke pas.",
    depositNotice:
      "Ces chèques sont conçus pour le dépôt mobile (photo dans l'application de votre banque). Ils ne conviennent pas au dépôt en succursale ni au guichet avec lecture MICR.",
    previewZoom: {
      open: "Aperçu agrandi du chèque",
      title: "Aperçu du chèque",
      hint: "Toucher pour agrandir",
      scrollHint: "Faites glisser dans toutes les directions pour voir le chèque en entier",
    },
    voidWatermark: "NUL",
    process: "TRAITER",
    processFootnoteCost: "1 crédit sera débité pour imprimer ce chèque.",
    processFootnoteBalance: "Solde actuel : {count} crédit",
    processFootnoteBalancePlural: "Solde actuel : {count} crédits",
    color: {
      label: "Couleur du chèque",
    },
    fields: {
      emitter: "Émetteur",
      chqNum: "N° chèque",
      date: "Date",
      emitterAddr: "Adresse émetteur",
      payee: "Bénéficiaire",
      bankName: "Institution",
      bankAddr: "Adresse institution",
      amount: "Montant ($)",
      transit: "Transit",
      inst: "Inst.",
      account: "Compte",
      memo: "Mémo",
    },
    account: {
      editButton: "Éditer # Compte",
      modalTitle: "Grille MICR du compte",
      modalHint:
        "Utilisez un de vos spécimens de chèque pour personnaliser ce chèque afin qu'il soit conforme. Le caractère 16 (⑆) sert de point de départ — glissez les chiffres et tirets dans les cases suivantes.",
      modalHintTouch:
        "Utilisez un de vos spécimens de chèque pour personnaliser ce chèque. Le caractère 16 (⑆) est fixe — touchez un symbole, puis une case pour le placer. Touchez un caractère déjà placé pour le déplacer.",
      gridLabel: "Spécimen — numéro de compte (à partir du caractère 16)",
      paletteLabel: "Symboles — glisser vers une case",
      paletteLabelTouch: "Symboles — toucher pour sélectionner",
      tapStatusPalette: "Symbole {char} sélectionné — touchez une case",
      tapStatusSlot: "Case {slot} sélectionnée — touchez la destination",
      closeSlotLabel: "Symbole On-Us de fermeture (case 16)",
      bankReservedSlotLabel: "Réservé — transit imprimé par la banque",
      readingHint: "Numérotation des positions depuis le bord droit du chèque.",
      reset: "Effacer tout",
      cancel: "Annuler",
      apply: "Appliquer",
      slotChar: "Case {slot}, caractère {char}",
      paletteChar: "Symbole {char}",
      removeSlot: "Retirer {char}",
    },
    save: {
      ariaLabel: "Sauvegarder les données du chèque dans le navigateur",
      title: "Sauvegarder",
      savedTitle: "Données enregistrées",
      failedTitle: "Sauvegarde impossible",
      failedBody:
        "Votre navigateur n'a pas pu enregistrer les informations localement. Vérifiez que le stockage local n'est pas bloqué.",
      body1:
        "Les champs du chèque sont sauvegardés dans votre navigateur (sur cet appareil uniquement). GoCheque ne reçoit ni ne stocke ces informations sur ses serveurs.",
      body2:
        "Lors de votre prochaine visite, vos données seront rechargées automatiquement pour accélérer la saisie.",
      lastSaved: "Dernière sauvegarde : {date}",
      confirm: "Compris",
    },
  },
  features: {
    items: [
      {
        title: "Dépôt mobile",
        text: "Destiné au dépôt mobile uniquement — imprimez, photographiez et déposez via l'app mobile de votre banque.",
      },
      {
        title: "Conforme CPA 006",
        text: "Mise en page conforme aux normes canadiennes : dimensions, bande MICR visuelle et format E-13B pour la capture mobile.",
      },
      {
        title: "Confidentialité Totale",
        text: "Vos données bancaires ne quittent jamais votre navigateur. Aucune base de données ne stocke vos informations sensibles.",
      },
      {
        title: "Économique et instantané",
        text: "Jusqu'à {percent} % moins cher qu'un chèque papier. Imprimez en quelques secondes — aucune commande, aucun délai de livraison.",
      },
    ],
  },
  pricing: {
    label: "Tarifs",
    title: "Choisissez votre forfait",
    subtitle:
      "Payez seulement ce que vous utilisez — chaque chèque traité et imprimé compte pour un. Un compte est requis pour acheter.",
    paperChequeRef: "chèque papier",
    savingsVsPaper: "{percent} % moins cher qu'un {reference}",
    featureInstant: "Impression instantanée — aucun délai",
    popular: "Populaire",
    chequesUnit: "{count} Chèques ~{price} l'unité",
    featurePrintable: "{count} chèques imprimables",
    featureCpa: "Conforme CPA 006",
    choosePlan: "Choisir ce forfait",
    signInToBuy: "Se connecter pour acheter",
    packages: {
      pack_starter: "Démarrage",
      pack_pro: "Pro",
      pack_volume: "Volume",
    },
    buyModal: {
      label: "Tarifs",
      title: "Acheter des crédits",
      subtitleEmpty:
        "Aucun crédit disponible — choisissez un forfait pour imprimer votre chèque.",
      subtitleDefault: "Choisissez un forfait pour obtenir de nouveaux crédits.",
      connected: "Connecté : {email}",
      back: "← Retour",
    },
  },
  faq: {
    label: "FAQ",
    title: "Questions fréquentes",
    subtitle: "Tout ce qu'il faut savoir avant de traiter votre premier chèque.",
    items: [
      {
        id: "credits",
        question: "Comment fonctionnent les crédits ?",
        answer:
          "Chaque crédit permet d'imprimer un chèque une fois. Vous achetez un forfait, les crédits sont ajoutés à votre compte, puis débités automatiquement à l'impression.",
      },
      {
        id: "validite",
        question: "Les crédits expirent-ils ?",
        answer:
          "Non. Votre solde de crédits reste sur votre compte sans date d'expiration. Vous les utilisez quand vous en avez besoin. L'historique des achats et des impressions est accessible dans votre tableau de bord.",
      },
      {
        id: "donnees",
        question:
          "Mes informations bancaires sont-elles enregistrées chez GoCheque ?",
        answer:
          "Non. Les données saisies dans l'éditeur (compte, transit, bénéficiaire, etc.) restent dans votre navigateur. Nous ne stockons pas vos chèques sur nos serveurs. Votre navigateur peut toutefois vous proposer d'enregistrer ces informations localement, comme pour une adresse ou une carte.",
      },
      {
        id: "depot-mobile",
        question: "Puis-je déposer ce chèque en succursale ?",
        answer:
          "Non. GoCheque produit des chèques pensés pour le dépôt mobile : vous imprimez le chèque, puis le photographiez dans l'application de votre banque. Le dépôt en succursale ou au guichet automatique exige généralement du papier chèque et une bande MICR magnétique que l'impression à domicile ne fournit pas. Vérifiez toujours les règles de votre institution.",
      },
      {
        id: "cpa",
        question: "Les chèques sont-ils conformes à la norme CPA 006 ?",
        answer:
          "La mise en page respecte les dimensions, la bande MICR, le format E-13B et la structure recto-verso prévus par la norme CPA 006, adaptée au dépôt mobile. L'impression sur papier ordinaire avec une imprimante classique ne produit pas d'encre magnétique — ces chèques ne remplacent pas un chèque MICR pour dépôt en succursale.",
      },
      {
        id: "impression",
        question: "Comment bien imprimer mon chèque ?",
        answer:
          "Reportez-vous au guide d'impression disponible sur la page d'impression du chèque. Il détaille les paramètres recommandés, le recto-verso et la découpe — il s'affiche lorsque vous lancez l'impression depuis l'éditeur.",
      },
      {
        id: "compte",
        question: "Faut-il un compte pour utiliser GoCheque ?",
        answer:
          "Oui. Pour prévenir la fraude et protéger chaque transaction, chaque chèque est verrouillé derrière l'authentification d'un compte gratuit. L'achat de crédits, leur gestion et l'impression exigent une connexion sécurisée — vos crédits sont rattachés à votre compte.",
      },
      {
        id: "papier",
        question: "Quel papier dois-je utiliser ?",
        answer:
          "Du papier Lettre US (8,5 × 11 po) suffit pour imprimer.",
      },
    ],
  },
  footer: {
    copyright: "© {year} GoCheque",
    contact: "Contact",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
  },
  contact: {
    metaTitle: "Nous joindre — GoCheque",
    metaDescription:
      "Écrivez à info@gocheque.ca pour le soutien, la facturation, les crédits ou la vie privée. GoCheque exploite gocheque.ca et gocheque.com.",
    title: "Contact",
    eyebrow: "Nous sommes là pour vous aider",
    message: "Écrivez-nous à",
    privacyTitle: "Vie privée et demandes d’accès",
    privacyBody:
      "Pour consulter, corriger ou supprimer des renseignements personnels, ou pour poser une question sur nos pratiques, écrivez-nous en indiquant « Confidentialité » dans l’objet. Nous répondons dans le délai prévu par le droit canadien.",
    billingTitle: "Facturation et crédits",
    billingBody:
      "Pour un double débit, des crédits manquants ou une demande de remboursement, indiquez le courriel du compte et la date approximative d’achat. Les paiements sont traités par Stripe.",
  },
  consent: {
    title: "Confidentialité et témoins",
    cookies:
      "Témoins essentiels seulement (langue, session, connexion). Stripe si vous payez. Aucun témoin publicitaire.",
    terms: "En choisissant Accepter, vous prenez acte de nos",
    and: "et de notre",
    accept: "Accepter",
  },
  privacy: privacyFr,
  terms: termsFr,

  auth: {
    signOutConfirm: "Êtes-vous certain de vouloir vous déconnecter ?",
    cancel: "Annuler",
    signingOut: "Déconnexion...",
    signOutAction: "Déconnecter",
    loginTitle: "Connexion",
    signupTitle: "Créer un compte",
    loginSubtitle: "Accédez à votre compte et consultez votre solde de crédits.",
    signupSubtitle: "Créez un compte pour sauvegarder vos crédits.",
    email: "Courriel",
    pseudo: "Pseudo",
    password: "Mot de passe",
    login: "Se connecter",
    signup: "S'inscrire",
    google: "Continuer avec Google",
    noAccount: "Pas de compte ?",
    hasAccount: "Déjà un compte ?",
    createAccount: "Créer un compte",
    signInLink: "Se connecter",
    confirmEmail: "Confirmez votre courriel avant de vous connecter",
    invalidCredentials: "Courriel ou mot de passe incorrect",
    loginFailed: "Connexion impossible. Réessayez.",
    signupSuccess:
      "Compte créé ! Vérifiez votre courriel pour confirmer, puis connectez-vous.",
    close: "Fermer",
    signupTab: "Inscription",
    signupLegalBefore: "J'accepte les",
    signupLegalMiddle: "et la",
    signupLegalRequired:
      "Vous devez accepter les conditions d'utilisation et la politique de confidentialité pour créer un compte.",
    checkoutSubtitle: "Connectez-vous pour acheter des chèques.",
    traiterSubtitle: "Connectez-vous pour traiter votre chèque.",
    loading: "Chargement...",
    weakPassword: "Choisissez un mot de passe plus solide.",
    googleError: "Connexion Google impossible",
    back: "← Retour",
    pseudoHint: "3 à 20 caractères : lettres, chiffres, tiret ou souligné.",
    passwordStrengthLabel: "Force du mot de passe",
    passwordStrong: "Solide",
    passwordMedium: "Moyen",
    passwordWeak: "Faible",
    passwordRules: {
      length: "Au moins 8 caractères",
      upper: "Une lettre majuscule",
      lower: "Une lettre minuscule",
      digit: "Un chiffre",
      special: "Un caractère spécial (!@#$%...)",
    },
    mfaLoginTitle: "Vérification en deux étapes",
    mfaLoginSubtitle:
      "Entrez le code à 6 chiffres de votre application d'authentification.",
    mfaLoginVerify: "Vérifier",
    mfaLoginFailed: "Code incorrect. Réessayez.",
    mfaSignupOfferTitle: "Sécuriser votre compte (optionnel)",
    mfaSignupOfferSubtitle:
      "Ajoutez une authentification à deux facteurs pour mieux protéger votre compte. Vous pourrez aussi l'activer plus tard dans Mon compte.",
    mfaSignupEnable: "Activer la 2FA",
    mfaSignupSkip: "Passer pour l'instant",
  },
  process: {
    title: "Traiter le chèque",
    titleCheque: "Traiter votre chèque",
    subtitleCredits:
      "1 crédit sera débité automatiquement pour imprimer ce chèque.",
    subtitleNoCredits:
      "Vous n'avez plus de crédits — achetez un forfait pour continuer.",
    currentBalance: "Solde actuel",
    oneCreditOnePrint: "1 crédit = 1 impression",
    print: "Imprimer le chèque",
    noCredits: "Aucun crédit disponible.",
    buyCredits: "Acheter des crédits",
    consumeGeneric: "Impossible de débiter un crédit",
    subtitleCreditsTouch:
      "1 crédit sera débité. Sur mobile, vous téléchargerez un PDF prêt à imprimer.",
    printTouch: "Continuer",
    mobilePrint: {
      title: "PDF prêt à imprimer",
      intro:
        "Préparez-vous à télécharger votre chèque en PDF pour une impression rapide.",
      step1: "Appuyez sur « Télécharger le PDF ».",
      step2:
        "Ouvrez le fichier dans Fichiers / Drive, puis imprimez à 100 % sans marges (AirPrint ou autre).",
      step3:
        "Coupez sous la ligne pointillée, puis photographiez le chèque dans l’app de dépôt de votre banque.",
      generateButton: "Télécharger le PDF",
      generating: "Génération du PDF…",
      successTitle: "PDF prêt",
      successIntro:
        "Le fichier a été téléchargé. Vous pouvez le retélécharger ou le partager (AirDrop, Messages, Imprimer…).",
      downloadButton: "Télécharger à nouveau",
      shareButton: "Partager…",
      shareText: "Chèque GoCheque — PDF prêt à imprimer",
      shareError: "Partage impossible. Utilisez le téléchargement.",
      generateError:
        "Impossible de générer le PDF. Revenez à l’éditeur et réessayez.",
      close: "Fermer",
    },
  },
  credits: {
    purchaseTitle: "Crédits ajoutés",
    purchaseAdded: "{count} crédit ajouté à votre compte",
    purchaseAddedPlural: "{count} crédits ajoutés à votre compte",
    balance: "{count} crédit disponible",
    balancePlural: "{count} crédits disponibles",
    continue: "Continuer",
    validityNote: "Les crédits sont ajoutés à votre solde de compte.",
    insufficient: "Crédits insuffisants — achetez un forfait.",
    listTitle: "Mes crédits",
    listSubtitle: "Solde et historique des transactions",
    loading: "Chargement de vos crédits...",
    empty: "Aucun crédit pour le moment",
    emptyFilter: "Aucune transaction dans cette catégorie.",
    filterAll: "Toutes",
    filterPurchases: "Achats",
    filterUses: "Impressions",
    emptyBuyHint: "Achetez un forfait depuis l'éditeur de chèque.",
    retry: "Réessayer",
    loadMore: "Charger plus",
    remaining: "({count} restante)",
    remainingPlural: "({count} restantes)",
    statsBalance: "Solde",
    statsPurchased: "Achetés",
    statsUsed: "Utilisés",
    loadError: "Impossible de charger les crédits",
    txnPurchase: "Achat — {count} crédit",
    txnPurchasePlural: "Achat — {count} crédits",
    txnConsume: "Impression — {count} crédit",
    txnConsumePlural: "Impression — {count} crédits",
    txnMigration: "Migration depuis l'ancien système",
    txnAdjustment: "Ajustement de solde",
    txnDate: "Le {date}",
    txnBalanceAfter: "Nouveau solde : {balance}",
    viewInvoices: "Voir mes factures",
    invoicesHint:
      "Consultez vos factures et reçus Stripe dans le portail de paiement sécurisé.",
    invoicesError: "Impossible d'ouvrir le portail factures Stripe.",
  },
  dashboard: {
    label: "Tableau de bord",
    navLabel: "Navigation du tableau de bord",
    greeting: "Bonjour, {name}",
    defaultUser: "Utilisateur",
    editorTitle: "Éditeur de chèque",
    editorSubtitle:
      "Remplissez votre chèque, traitez-le et imprimez-le depuis votre compte.",
    createCheque: "Créer un chèque",
    createChequeDesc:
      "Ouvrir l'éditeur pour remplir, traiter et imprimer un nouveau chèque.",
    openEditor: "Ouvrir l'éditeur →",
    creditsAvailable:
      "{count} crédit disponible pour imprimer",
    creditsAvailablePlural:
      "{count} crédits disponibles pour imprimer",
  },
  account: {
    title: "Mon compte",
    subtitle: "Gérez vos informations et la sécurité de votre compte.",
    collapseAll: "Fermer toutes les sections",
    profileTitle: "Profil",
    profileDescription: "Votre identité et votre adresse courriel.",
    changePassword: "Modifier le mot de passe",
    passwordDescription:
      "Confirmez votre mot de passe actuel avant d'en choisir un nouveau.",
    currentPassword: "Mot de passe actuel",
    currentPasswordInvalid: "Mot de passe actuel incorrect.",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    savePassword: "Enregistrer le mot de passe",
    saveProfile: "Enregistrer le profil",
    passwordUpdated: "Mot de passe mis à jour avec succès.",
    passwordUpdateFailed: "Impossible de mettre à jour le mot de passe.",
    profileUpdated: "Profil mis à jour avec succès.",
    profileUpdateFailed: "Impossible de mettre à jour le profil.",
    securityTitle: "Authentification à deux facteurs",
    securityDescription:
      "Protégez votre compte avec une application d'authentification (Google Authenticator, Authy, etc.).",
    mfaStatusEnabled: "Activée",
    mfaStatusDisabled: "Non configurée",
    mfaEnable: "Configurer la 2FA",
    mfaDisable: "Désactiver la 2FA",
    mfaScanQr:
      "Scannez ce code QR avec votre application d'authentification, puis entrez le code à 6 chiffres.",
    mfaEnterCode: "Code à 6 chiffres",
    mfaVerify: "Vérifier et activer",
    mfaCancel: "Annuler",
    mfaEnrollFailed: "Impossible de démarrer la configuration 2FA.",
    mfaVerifyFailed: "Code incorrect. Réessayez.",
    mfaEnabledSuccess: "Authentification à deux facteurs activée.",
    mfaDisabledSuccess: "Authentification à deux facteurs désactivée.",
    mfaDisableFailed: "Impossible de désactiver la 2FA.",
    mfaLoading: "Chargement de la sécurité…",
  },
  notFound: {
    code: "404",
    title: "Page introuvable",
    description:
      "La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'adresse ou retournez à l'accueil.",
    backHome: "Retour à l'accueil",
    backDashboard: "Tableau de bord",
    metaTitle: "Page introuvable",
    metaDescription: "Cette page n'existe pas sur GoCheque.",
  },
  common: {
    close: "Fermer",
    scrollToTop: "Retour en haut de la page",
    or: "ou",
    loading: "Chargement...",
    error: "Erreur",
    errorPurchase: "Erreur lors de l'achat",
  },
  anchors: {
    gallery: "apercu",
    editor: "apercu",
    features: "securite",
    pricing: "tarifs",
    faq: "faq",
  },
};

export type Dictionary = typeof dictionary;

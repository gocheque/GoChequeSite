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
    scrollHint: "Faites défiler pour continuer",
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
    metaTitle: "Contact",
    metaDescription: "Contactez l'équipe GoCheque par courriel.",
    title: "Contact",
    message: "Pour nous joindre, envoyez un courriel à",
  },
  consent: {
    title: "Cookies et confidentialité",
    cookies:
      "Nous utilisons des cookies essentiels pour la langue, la session et l'authentification.",
    terms: "En cliquant sur Accepter, vous acceptez nos",
    and: "et notre",
    accept: "Accepter",
  },
  privacy: {
    metaTitle: "Politique de confidentialité",
    metaDescription:
      "Politique de confidentialité de GoCheque — comment nous traitons vos renseignements personnels au Canada.",
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : 6 juillet 2026",
    intro:
      "GoCheque s'engage à protéger votre vie privée. Cette politique explique quels renseignements nous collectons, comment nous les utilisons et quels sont vos droits lorsque vous utilisez notre service de génération et d'impression de chèques pour dépôt mobile.",
    sections: [
      {
        title: "1. Responsable du traitement",
        body:
          "GoCheque exploite le site gocheque.ca et est responsable des renseignements personnels collectés via les Services, sous réserve des lois applicables au Canada.",
      },
      {
        title: "2. Renseignements que nous collectons",
        body:
          "Compte utilisateur : courriel, identifiant de compte, pseudo (le cas échéant), informations d'authentification et préférences de sécurité (ex. authentification à deux facteurs).\n\nTransactions : solde de crédits, historique d'achats et de consommation de crédits, identifiants de transaction Stripe.\n\nDonnées techniques : adresse IP, type de navigateur, journaux de connexion et cookies essentiels (langue, session).\n\nCommunications : messages que vous nous envoyez pour obtenir de l'aide.",
      },
      {
        title: "3. Renseignements que nous ne stockons pas",
        body:
          "Les données saisies dans l'éditeur de chèque — numéros de compte, transit, institution, bénéficiaire, montants, signatures, etc. — sont traitées localement dans votre navigateur et ne sont pas conservées sur nos serveurs à des fins de conservation de chèques.\n\nVotre navigateur peut toutefois enregistrer ces champs localement (stockage local) ou vous proposer de les mémoriser, indépendamment de GoCheque.",
      },
      {
        title: "4. Comment nous utilisons vos renseignements",
        body:
          "Nous utilisons vos renseignements pour :\n\n• créer et gérer votre compte ;\n• traiter les achats de crédits et fournir le service ;\n• sécuriser l'accès et prévenir la fraude ;\n• répondre à vos demandes ;\n• respecter nos obligations légales ;\n• améliorer la fiabilité et la sécurité du service.\n\nNous ne vendons pas vos renseignements personnels.",
      },
      {
        title: "5. Fondements du traitement",
        body:
          "Nous traitons vos renseignements sur la base de l'exécution du contrat (fourniture du service), de votre consentement (lorsque requis), de nos intérêts légitimes (sécurité, amélioration du service) et du respect d'obligations légales, conformément aux lois applicables au Canada.",
      },
      {
        title: "6. Cookies et stockage local",
        body:
          "Cookies essentiels : préférence de langue, session d'authentification Supabase et cookies nécessaires au paiement via Stripe lors d'un achat.\n\nStockage local : brouillon de chèque et identifiants techniques locaux peuvent être enregistrés dans votre navigateur pour le fonctionnement de l'éditeur.\n\nNous n'utilisons pas de cookies publicitaires ni d'outils d'analyse tiers au moment de la publication de cette politique.",
      },
      {
        title: "7. Services tiers",
        body:
          "Nous faisons appel à des prestataires pour exploiter le service :\n\n• Supabase — authentification et base de données de compte ;\n• Stripe — traitement des paiements ;\n• Google — connexion OAuth, si vous choisissez cette option.\n\nCes prestataires traitent des renseignements conformément à leurs propres politiques de confidentialité. Nous ne contrôlons pas leurs pratiques.",
      },
      {
        title: "8. Conservation des données",
        body:
          "Nous conservons vos renseignements de compte et d'achat aussi longtemps que nécessaire pour fournir le service, respecter nos obligations légales, résoudre des litiges et faire respecter nos accords. Vous pouvez demander la suppression de votre compte, sous réserve des obligations légales de conservation.",
      },
      {
        title: "9. Sécurité",
        body:
          "Nous appliquons des mesures techniques et organisationnelles raisonnables pour protéger vos renseignements. Aucune méthode de transmission ou de stockage n'est toutefois totalement sécurisée. Vous êtes responsable de la protection de votre appareil, de votre session et des données saisies dans l'éditeur.",
      },
      {
        title: "10. Vos droits",
        body:
          "Selon les lois applicables au Canada, vous pouvez avoir le droit d'accéder à vos renseignements, de les faire corriger, de retirer votre consentement (lorsque le traitement est fondé sur le consentement) ou de demander leur suppression, dans les limites prévues par la loi.\n\nPour exercer ces droits, écrivez à info@gocheque.ca. Nous répondrons dans les délais prévus par la loi applicable.",
      },
      {
        title: "11. Enfants",
        body:
          "GoCheque n'est pas destiné aux personnes de moins de dix-huit (18) ans. Nous ne collectons pas sciemment de renseignements personnels auprès de mineurs.",
      },
      {
        title: "12. Transferts et hébergement",
        body:
          "Vos renseignements peuvent être traités ou hébergés à l'extérieur de votre province ou du Canada par nos prestataires (par exemple, aux États-Unis). Dans ce cas, vos renseignements peuvent être assujettis aux lois locales de ces juridictions.",
      },
      {
        title: "13. Modifications",
        body:
          "Nous pouvons mettre à jour cette politique de temps à autre. La date de dernière mise à jour sera indiquée en haut de la page. L'utilisation continue du service après publication des modifications vaut prise de connaissance de la politique révisée.",
      },
      {
        title: "14. Contact",
        body:
          "Pour toute question relative à cette politique ou à vos renseignements personnels, écrivez à info@gocheque.ca.",
      },
    ],
  },
  terms: {
    metaTitle: "Conditions d'utilisation",
    metaDescription:
      "Conditions d'utilisation du service GoCheque — génération et impression de chèques pour dépôt mobile au Canada.",
    title: "Conditions d'utilisation",
    lastUpdated: "Dernière mise à jour : 6 juillet 2026",
    intro:
      "Contrat contraignant. Veuillez lire attentivement ces conditions avant d'utiliser GoCheque.\n\nEn créant un compte, en achetant des crédits ou en utilisant le service, vous acceptez d'être lié par les présentes conditions d'utilisation ainsi que par toute politique incorporée par référence. Si vous n'acceptez pas ces conditions dans leur intégralité, vous ne devez pas utiliser le service.",
    sections: [
      {
        title: "1. Le service",
        body:
          "GoCheque (« nous », « notre ») exploite le site gocheque.ca et fournit une application en ligne (le « Site » et l'« Application ») permettant de générer et d'imprimer des chèques bancaires canadiens au format CPA 006 (les « Services »). Les Services sont destinés au dépôt mobile via l'application de votre institution financière — non au dépôt en succursale ou au guichet automatique.\n\nGoCheque est un service d'impression et de mise en page de chèques, et non un service de paiement de factures, de virement bancaire ou de traitement de paiements. Nous ne vérifions pas vos numéros de transit ou de compte, vos bénéficiaires, leurs adresses ni l'autorisation d'utiliser un compte bancaire donné.",
      },
      {
        title: "2. Acceptation et modifications",
        body:
          "Ces conditions prennent effet lorsque vous utilisez les Services ou créez un compte (la « Date d'entrée en vigueur »). Nous pouvons modifier ces conditions à tout moment. Les changements importants seront publiés sur cette page avec une date de mise à jour. Votre utilisation continue des Services après publication constitue votre acceptation des conditions révisées. Si vous n'acceptez pas les conditions modifiées, vous devez cesser d'utiliser les Services et pouvez fermer votre compte.",
      },
      {
        title: "3. Éligibilité",
        body:
          "Les Services ne sont pas destinés aux enfants. Vous devez avoir au moins dix-huit (18) ans pour utiliser GoCheque. Si nous déterminons qu'un utilisateur est mineur, nous pouvons résilier son accès. Les Services sont pour votre usage personnel ou professionnel propre ; vous ne pouvez pas les revendre, les louer ni les fournir à des tiers, sauf autorisation expresse.",
      },
      {
        title: "4. Confidentialité",
        body:
          "L'utilisation des Services est également régie par notre politique de confidentialité publiée sur le Site. En utilisant GoCheque, vous consentez à la collecte et à l'utilisation de vos renseignements personnels conformément à cette politique et aux lois applicables au Canada.",
      },
      {
        title: "5. Compte, inscription et sécurité",
        body:
          "Pour acheter des crédits et imprimer des chèques, vous devez créer un compte et fournir des renseignements exacts, complets et à jour. Vous devez maintenir ces renseignements à jour.\n\nVous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité sur votre compte. Avisez-nous immédiatement de toute utilisation non autorisée ou suspectée. Vous êtes responsable de tous les frais et de toutes les actions effectuées via votre compte.\n\nVous devez mettre en place des mesures de sécurité adéquates pour protéger vos renseignements bancaires et éviter l'émission de chèques non autorisés.",
      },
      {
        title: "6. Utilisation acceptable",
        body:
          "En utilisant les Services, vous acceptez de ne pas :\n\n• compromettre la sécurité ou l'intégrité des systèmes de GoCheque ou de ses hébergeurs ;\n• utiliser les Services d'une manière qui nuit à leur fonctionnement ou à celui d'autres utilisateurs ;\n• tenter d'accéder sans autorisation à des données ou systèmes ;\n• transmettre du contenu illégal, offensant, nuisible ou portant atteinte aux droits de tiers ;\n• copier, décompiler, désassembler ou tenter d'extraire le code source de l'Application, sauf dans la mesure strictement permise par la loi ;\n• utiliser des robots, scrapers ou outils similaires sur le Site sans autorisation écrite.\n\nNous pouvons suspendre ou résilier votre compte en cas de violation.",
      },
      {
        title: "7. Services d'impression de chèques et vos responsabilités",
        body:
          "Les chèques sont créés à partir des informations que vous saisissez dans votre compte GoCheque. Vous êtes seul responsable de l'exactitude des renseignements, de l'autorisation d'émettre chaque chèque et de la conformité de son utilisation avec les règles de votre institution financière.\n\nGoCheque ne suit pas vos chèques, vos paiements ni vos comptes bancaires au-delà de ce qui est nécessaire pour fournir le service (compte utilisateur, crédits, historique de transactions). Nous ne sommes pas responsables de l'émission, de l'impression ou de l'utilisation d'un chèque non autorisé, ni de tout rejet de dépôt, pénalité bancaire ou perte financière en découlant.\n\nVous reconnaissez que l'impression à domicile sur papier ordinaire ne produit pas d'encre magnétique MICR et que la mise en page CPA 006 fournie est adaptée au dépôt mobile, non au dépôt en succursale. GoCheque ne garantit pas que votre banque acceptera un chèque imprimé via le service.",
      },
      {
        title: "8. Avertissement — fraude et chèques contrefaits",
        body:
          "Il est strictement interdit d'utiliser GoCheque pour créer de faux chèques, des chèques contrefaits, trompeurs ou frauduleux. La fraude par chèque est un délit grave au Canada et peut entraîner des poursuites civiles et criminelles.\n\nNous prenons la fraude au sérieux et pouvons surveiller l'activité des comptes par des moyens manuels ou automatisés. Si une activité frauduleuse est détectée, nous pouvons suspendre ou résilier immédiatement et définitivement votre accès, sans remboursement, et coopérer avec les autorités compétentes. Cette décision est finale.",
      },
      {
        title: "9. Crédits, frais, taxes et remboursements",
        body:
          "L'impression d'un chèque consomme un crédit. Les tarifs sont affichés sur le Site et peuvent être modifiés. En cas de changement de prix, nous nous efforcerons de vous en aviser au moins trente (30) jours à l'avance lorsque la loi l'exige ; votre utilisation continue après l'entrée en vigueur du nouveau tarif constitue votre acceptation.\n\nLes crédits sont achetés via Stripe, notre processeur de paiement tiers. Les prix sont indiqués en dollars canadiens (CAD), sauf indication contraire. Les taxes applicables (TPS/TVQ, TVH, etc.) peuvent s'ajouter selon votre juridiction.\n\nPolitique de remboursement :\n• Les crédits sont des biens numériques ajoutés à votre compte immédiatement après l'achat.\n• Les crédits achetés sont non transférables et, en règle générale, non remboursables une fois livrés sur votre compte.\n• Aucun remboursement n'est accordé pour les crédits non utilisés ou pour une impression déjà consommée.\n• Nous pouvons accorder un remboursement ou un crédit compensatoire en cas d'erreur de facturation avérée, de double paiement ou de problème technique imputable à GoCheque, à notre discrétion et conformément à la loi applicable.\n• Pour toute demande de remboursement, contactez info@gocheque.ca dans les trente (30) jours suivant l'achat en indiquant votre courriel de compte et la date de transaction.\n\nMalgré le soin apporté à la description des Services, des erreurs typographiques ou de prix peuvent survenir ; nous nous réservons le droit de les corriger.",
      },
      {
        title: "10. Propriété intellectuelle",
        body:
          "Le Site, la marque GoCheque, l'Application, les interfaces, le code et tout contenu fourni par GoCheque (le « Contenu ») sont protégés par les lois sur la propriété intellectuelle. Sauf licence expresse ci-dessous, aucun droit ne vous est accordé sur ce Contenu.\n\nLes informations de chèque que vous saisissez demeurent sous votre responsabilité. GoCheque ne revendique aucun droit de propriété sur le contenu de vos chèques saisi dans l'éditeur, qui est traité localement dans votre navigateur.",
      },
      {
        title: "11. Licence limitée",
        body:
          "GoCheque vous accorde une licence limitée, révocable, non exclusive et non transférable pour accéder aux Services et les utiliser conformément aux présentes conditions, uniquement pour votre usage personnel ou professionnel interne. Vous ne pouvez pas modifier, reproduire, distribuer ou exploiter commercialement le Contenu sans autorisation écrite préalable. Toute utilisation non autorisée peut entraîner la résiliation de votre compte.",
      },
      {
        title: "12. Disponibilité et sécurité du service",
        body:
          "Nous déployons des efforts raisonnables pour maintenir un service fiable et sécurisé. Toutefois, aucun système n'est parfaitement sécurisé ou disponible en permanence. Internet comporte des risques inhérents et nous ne pouvons garantir une disponibilité ininterrompue ni une sécurité absolue des données.\n\nEn utilisant GoCheque, vous acceptez ces risques. Vous reconnaissez que les renseignements bancaires saisis dans l'éditeur sont sous votre contrôle dans votre navigateur et que vous êtes responsable de la protection de votre appareil et de votre session.",
      },
      {
        title: "13. Services tiers",
        body:
          "Les Services peuvent intégrer ou renvoyer vers des services tiers, notamment Stripe pour les paiements et Supabase pour l'authentification. Votre utilisation de ces services est régie par leurs propres conditions et politiques. GoCheque n'est pas responsable des services tiers ni de leurs pratiques en matière de données.",
      },
      {
        title: "14. Exclusion de garanties",
        body:
          "DANS LA MESURE PERMISE PAR LA LOI, LES SERVICES ET LE CONTENU SONT FOURNIS « TELS QUELS » ET « SELON DISPONIBILITÉ », SANS GARANTIE D'AUCUNE SORTE, EXPRESSE OU IMPLICITE, NOTAMMENT QUANT À LA QUALITÉ MARCHANDE, L'ADÉQUATION À UN USAGE PARTICULIER, L'ABSENCE D'ERREUR, LA SÉCURITÉ, L'ACCEPTATION DES CHÈQUES PAR UNE BANQUE OU LA CONFORMITÉ À TOUTE OBLIGATION LÉGALE DE VOTRE PART.\n\nCertaines juridictions n'autorisent pas l'exclusion de garanties implicites ; dans ce cas, certaines exclusions peuvent ne pas s'appliquer à vous.",
      },
      {
        title: "15. Limitation de responsabilité et indemnisation",
        body:
          "DANS LA MESURE PERMISE PAR LA LOI, GOCHÈQUE ET SES EXPLOITANTS NE SERONT PAS RESPONSABLES DES DOMMAGES INDIRECTS, SPÉCIAUX, ACCESSOIRES, PUNITIFS OU CONSÉCUTIFS, NI DES PERTES DE PROFITS, DE DONNÉES, DE REVENUS OU DE CLIENTÈLE, DÉCOULANT DE L'UTILISATION OU DE L'IMPOSSIBILITÉ D'UTILISER LES SERVICES.\n\nNotre responsabilité totale cumulative pour toute réclamation liée aux Services est limitée au montant que vous avez payé à GoCheque au cours des douze (12) mois précédant l'événement à l'origine de la réclamation.\n\nVous acceptez de défendre, d'indemniser et de dégager de toute responsabilité GoCheque contre toute réclamation, perte ou frais (y compris les honoraires raisonnables d'avocat) découlant de votre utilisation des Services, de vos chèques, de vos données ou de toute violation des présentes conditions.",
      },
      {
        title: "16. Résiliation",
        body:
          "Vous pouvez cesser d'utiliser les Services à tout moment. Nous pouvons suspendre ou résilier votre accès, avec ou sans préavis, si vous violez ces conditions, en cas de fraude suspectée ou pour toute autre raison légitime. En cas de résiliation, les dispositions qui, par leur nature, doivent survivre (responsabilité, propriété intellectuelle, droit applicable) demeureront en vigueur.",
      },
      {
        title: "17. Droit applicable",
        body:
          "Les présentes conditions sont régies par les lois du Canada et les lois applicables dans votre province ou territoire de résidence, sous réserve des dispositions impératives de protection des consommateurs qui pourraient s'appliquer à vous.",
      },
      {
        title: "18. Dispositions générales",
        body:
          "Si une disposition des présentes conditions est jugée invalide ou inapplicable, les autres dispositions demeurent en vigueur. Ces conditions constituent l'intégralité de l'accord entre vous et GoCheque concernant les Services et remplacent tout accord antérieur sur le même objet. GoCheque peut céder ses droits en vertu des présentes ; vous ne pouvez pas céder vos droits sans notre consentement écrit préalable.",
      },
      {
        title: "19. Contact",
        body:
          "Pour toute question concernant ces conditions, écrivez à info@gocheque.ca.",
      },
    ],
  },
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
        "Préparez-vous à télécharger votre chèque en PDF pour une impression rapide (Lettre US, 2 pages — comme sur ordinateur).",
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

import type { LegalDocument } from "@/lib/legal/types";

const CONTACT = "info@gocheque.ca";

export const privacyFr: LegalDocument = {
  metaTitle: "Politique de confidentialité",
  metaDescription:
    "Politique de confidentialité de GoCheque — collecte, utilisation et protection des renseignements personnels au Canada, y compris la LPRPDE et la Loi 25 du Québec.",
  title: "Politique de confidentialité",
  lastUpdated: "Dernière mise à jour : 28 août 2026",
  intro:
    "GoCheque (« nous ») exploite gocheque.ca et offre un service en ligne pour générer et imprimer des chèques bancaires canadiens destinés au dépôt mobile. La présente politique explique comment nous traitons les renseignements personnels.\n\nLe produit est conçu pour que le contenu du chèque (numéros de compte, transit, bénéficiaire, montants et champs similaires) demeure dans votre navigateur. Les données de compte, de facturation et de sécurité nécessaires au service sont conservées chez nos fournisseurs de traitement.\n\nGoCheque ne publie pas actuellement d’adresse civique dans cette politique. Pour toute demande relative à la vie privée, écrivez à " +
    CONTACT +
    ". Nous identifierons l’organisation et, lorsque la loi l’exige, la personne responsable de la protection des renseignements personnels.",
  sections: [
    {
      title: "1. Qui nous sommes et champ d’application",
      body:
        "Cette politique s’applique aux renseignements personnels collectés via gocheque.ca, l’application GoCheque, les courriels connexes et notre canal de soutien.\n\nGoCheque est un service logiciel canadien. Nous traitons les renseignements conformément à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) et, pour les résidents du Québec, à la Loi 25 (Loi modernisant des dispositions législatives en matière de protection des renseignements personnels, dont la Loi sur la protection des renseignements personnels dans le secteur privé). D’autres lois provinciales peuvent aussi s’appliquer selon votre lieu de résidence.\n\nNous ne vendons pas les renseignements personnels.",
    },
    {
      title: "2. Renseignements que nous collectons",
      body:
        "Compte et identité : adresse courriel, identifiant de compte, nom d’utilisateur facultatif (pseudo), identifiants d’authentification et paramètres d’authentification à deux facteurs si vous l’activez. Si vous vous connectez avec Google, nous recevons les identifiants que Google fournit pour cette connexion.\n\nFacturation et crédits : solde de crédits, historique d’achat et de consommation, identifiants client et de transaction Stripe, et les informations dont Stripe a besoin pour vous facturer (traitées par Stripe ; GoCheque ne conserve pas les numéros de carte complets sur ses serveurs).\n\nDonnées techniques et de sécurité : adresse IP, type de navigateur et d’appareil, métadonnées approximatives de connexion, journaux d’exploitation et de sécurité, préférence de langue et jetons de session.\n\nCommunications : courriels ou messages que vous envoyez à " +
        CONTACT +
        ".\n\nNous ne demandons pas votre numéro d’assurance sociale et n’exigeons pas d’adresse civique pour créer un compte.",
    },
    {
      title: "3. Renseignements que nous ne stockons pas sur nos serveurs",
      body:
        "Le contenu de l’éditeur de chèque — y compris les noms et adresses saisis sur le chèque, les numéros de transit et d’institution, le numéro de compte, le numéro de série, les montants, la mention et les images de signature — est traité localement dans votre navigateur pour la mise en page et l’impression. Il n’est pas téléversé sur les serveurs de GoCheque aux fins de conservation des chèques.\n\nVotre navigateur peut conserver des brouillons dans le stockage local de cet appareil, ou proposer le remplissage automatique. Ce stockage est sous votre contrôle. Effacer les données du site sur l’appareil supprime ces brouillons.\n\nL’impression sur votre appareil (y compris la génération d’un PDF sur l’appareil) se fait sur l’appareil. Nous ne recevons pas de copie du chèque imprimé.",
    },
    {
      title: "4. Utilisation des renseignements",
      body:
        "Nous utilisons les renseignements personnels pour :\n\n• créer et administrer votre compte ;\n• vous authentifier et protéger le compte (y compris l’authentification à deux facteurs facultative) ;\n• vendre, livrer et comptabiliser les crédits d’impression, et traiter les paiements via Stripe ;\n• prévenir la fraude, l’abus et l’usage non autorisé du service ;\n• offrir du soutien et répondre aux demandes légales ;\n• exploiter, sécuriser et améliorer la fiabilité du site (y compris une mesure d’audience limitée, décrite ci-dessous) ;\n• envoyer des messages transactionnels (confirmation de courriel, réinitialisation de mot de passe, reçus d’achat) nécessaires au service ;\n• respecter le droit canadien.\n\nNous n’utilisons pas le contenu de vos chèques à des fins publicitaires. Nous ne constituons pas de profils marketing à partir des données de chèque, car elles ne sont pas stockées sur nos serveurs.",
    },
    {
      title: "5. Fondements juridiques et Québec (Loi 25)",
      body:
        "Nous ne collectons, n’utilisons et ne communiquons les renseignements personnels que pour les fins décrites dans cette politique, ou des fins compatibles, dans la mesure permise par la loi.\n\nSelon le contexte, le traitement repose sur : l’exécution de notre contrat avec vous (fournir le service demandé) ; votre consentement (par exemple, la création de compte et l’acceptation de cette politique) ; nos besoins légitimes de sécuriser le service et de prévenir la fraude ; et les obligations légales.\n\nSi vous êtes au Québec, nous respectons en outre la Loi 25, notamment l’obligation de déterminer les fins de la collecte, de limiter la collecte à ce qui est nécessaire et de maintenir des mesures de gouvernance adaptées à la sensibilité des renseignements. Les données bancaires d’un chèque sont sensibles ; c’est pourquoi elles restent sur votre appareil.\n\nVous pouvez retirer votre consentement lorsque le traitement est fondé sur le consentement, sous réserve des restrictions légales ou contractuelles (par exemple, nous pouvons conserver des dossiers exigés pour la fiscalité, un litige ou la prévention de la fraude). Le retrait du consentement peut empêcher le maintien du compte.",
    },
    {
      title: "6. Témoins, stockage local et technologies similaires",
      body:
        "Nous utilisons des témoins (cookies) et technologies similaires strictement nécessaires :\n\n• Langue : pour mémoriser le français ou l’anglais.\n• Session et authentification : pour que vous restiez connecté de façon sécurisée (Supabase). Ils sont requis pour le fonctionnement du compte.\n• Paiement : lorsque vous achetez des crédits, Stripe peut déposer des témoins nécessaires au paiement et à la prévention de la fraude.\n\nLe stockage local de votre appareil peut contenir des brouillons de chèque et l’enregistrement de votre acceptation de cette politique et des Conditions d’utilisation.\n\nMesure d’audience : nous utilisons Vercel Web Analytics et Speed Insights, fournis par notre hébergeur, pour comprendre le trafic et la performance. Ces outils sont configurés pour limiter le suivi de type publicitaire. Nous n’utilisons pas de témoins publicitaires de tiers et ne vendons pas de données à des réseaux publicitaires.\n\nVous pouvez refuser les témoins non essentiels dans votre navigateur. Bloquer les témoins strictement nécessaires empêchera la connexion et le paiement de fonctionner.",
    },
    {
      title: "7. LCAP et messages électroniques",
      body:
        "La Loi canadienne anti-pourriel (LCAP) s’applique aux messages électroniques commerciaux. Nous envoyons les messages transactionnels et relationnels nécessaires à l’exploitation de votre compte (sécurité, reçus, avis de service).\n\nNous n’envoyons pas de campagnes courriel promotionnelles sans le consentement exigé par la LCAP. Si nous envoyons un jour des messages électroniques commerciaux, ils identifieront GoCheque, indiqueront " +
        CONTACT +
        " comme contact et offriront un mécanisme de désabonnement. Vous pouvez aussi écrire à " +
        CONTACT +
        " pour refuser les messages commerciaux facultatifs.",
    },
    {
      title: "8. Fournisseurs de services",
      body:
        "Nous faisons appel à des sous-traitants pour exploiter GoCheque :\n\n• Supabase — authentification, base de comptes et hébergement connexe.\n• Stripe — traitement des paiements, factures, calcul des taxes le cas échéant, et portail de facturation.\n• Google — uniquement si vous choisissez « Continuer avec Google ».\n• Vercel — hébergement du site, mesure d’audience et de performance.\n\nCes fournisseurs traitent les renseignements selon leurs propres conditions et politiques. Nous leur imposons, par contrat le cas échéant, d’utiliser les renseignements seulement pour nous fournir leurs services. Nous ne contrôlons pas leurs pratiques indépendantes.",
    },
    {
      title: "9. Transferts hors de votre province ou du Canada",
      body:
        "Nos sous-traitants peuvent stocker ou consulter des renseignements aux États-Unis ou dans d’autres pays. Lorsqu’un renseignement quitte le Canada, il peut être assujetti aux lois de ce territoire, y compris l’accès légal par des autorités étrangères.\n\nNous utilisons des fournisseurs reconnus et des mesures contractuelles adaptées. En utilisant GoCheque, vous comprenez que les données de compte et de facturation peuvent être traitées hors du Québec et hors du Canada.",
    },
    {
      title: "10. Conservation",
      body:
        "Nous conservons les dossiers de compte, de crédits et de transactions pendant la durée du compte et ensuite pendant une période raisonnable aux fins comptables, fiscales, de litige, de sécurité et de conformité.\n\nLes brouillons de chèque restent sur votre appareil jusqu’à ce que vous les effaciez.\n\nLorsque les renseignements ne sont plus requis, nous les détruisons ou les dépersonnalisons par des moyens raisonnables.",
    },
    {
      title: "11. Sécurité",
      body:
        "Nous appliquons des mesures administratives, techniques et physiques raisonnables pour un service logiciel hébergé, notamment le transport chiffré (HTTPS), des contrôles d’accès et une authentification pouvant inclure un second facteur.\n\nAucune méthode de transmission ou de stockage n’est parfaitement sûre. Vous êtes responsable de la sécurité de votre appareil, de votre mot de passe, de votre application d’authentification et de toute donnée de chèque stockée localement ou imprimée.",
    },
    {
      title: "12. Incidents de confidentialité",
      body:
        "Si un incident de confidentialité concernant des renseignements personnels présente un risque de préjudice sérieux, nous aviserons la Commission d’accès à l’information du Québec lorsque le droit québécois l’exige, le Commissaire à la protection de la vie privée du Canada lorsque la LPRPDE l’exige, et les personnes concernées selon le droit applicable. Vous pouvez aussi écrire à " +
        CONTACT +
        " si vous croyez que vos renseignements ont été compromis.",
    },
    {
      title: "13. Traitement automatisé et profilage",
      body:
        "Nous pouvons utiliser des revues automatisées ou manuelles pour détecter la fraude, les rétrofacturations ou l’abus de crédits. Nous ne prenons pas de décisions automatisées qui accordent ou refusent un prêt, un crédit à la consommation ou un emploi. Nous n’utilisons pas les images de chèque ni le contenu des champs à des fins de profilage, car nous ne les stockons pas sur nos serveurs.",
    },
    {
      title: "14. Vos droits (Canada et Québec)",
      body:
        "Sous réserve des limites légales, vous pouvez demander :\n\n• l’accès aux renseignements personnels que nous détenons sur vous ;\n• la rectification des renseignements inexacts ou incomplets ;\n• le retrait du consentement lorsque le traitement est fondé sur le consentement ;\n• la suppression de votre compte et des renseignements associés ;\n• d’être informé des catégories de renseignements détenus et de leur utilisation.\n\nLes résidents du Québec peuvent aussi exercer les droits prévus par la Loi 25, notamment le droit d’obtenir des informations sur nos pratiques et, le cas échéant, la portabilité dans un format structuré lorsque la loi l’exige.\n\nPour exercer ces droits, écrivez à " +
        CONTACT +
        " à partir de l’adresse de votre compte et décrivez votre demande. Nous pouvons vérifier votre identité. Nous répondrons dans le délai prévu par la loi (généralement 30 jours, sous réserve des prolongations permises).\n\nVous pouvez déposer une plainte auprès du Commissariat à la protection de la vie privée du Canada ou, si vous êtes au Québec, auprès de la Commission d’accès à l’information du Québec.",
    },
    {
      title: "15. Enfants",
      body:
        "GoCheque s’adresse aux adultes. Vous devez avoir au moins 18 ans. Nous ne collectons pas sciemment de renseignements auprès de mineurs. Si nous apprenons qu’un compte appartient à une personne de moins de 18 ans, nous le fermerons et supprimerons les renseignements associés, sauf obligation légale de conservation.",
    },
    {
      title: "16. Modifications",
      body:
        "Nous pouvons mettre à jour cette politique. La date en tête de page sera modifiée. En cas de changement important, la politique révisée sera présentée sur le site. Lorsque la loi exige un nouveau consentement, nous le demanderons (y compris en renouvelant la bannière de confidentialité). L’utilisation continue après la date d’entrée en vigueur, lorsque la loi le permet, vaut prise de connaissance de la politique révisée.",
    },
    {
      title: "17. Contact et responsable de la protection des renseignements",
      body:
        "Demandes, questions et plaintes relatives à la vie privée : " +
        CONTACT +
        ".\n\nIndiquez « Confidentialité » dans l’objet.\n\nGoCheque n’a pas publié d’adresse civique ni le nom d’un responsable de la protection des renseignements personnels dans cette politique. Tant que ces précisions n’apparaissent pas sur gocheque.ca, utilisez le courriel ci-dessus. Nous acheminerons votre demande à la personne responsable et fournirons, dans notre réponse, les éléments d’identification exigés par la loi.\n\nLe présent texte ne remplace pas un avis juridique indépendant.",
    },
  ],
};

export const termsFr: LegalDocument = {
  metaTitle: "Conditions d’utilisation",
  metaDescription:
    "Conditions d’utilisation de GoCheque — mise en page et impression de chèques canadiens pour dépôt mobile, comptes, crédits, facturation Stripe et usage acceptable.",
  title: "Conditions d’utilisation",
  lastUpdated: "Dernière mise à jour : 28 août 2026",
  intro:
    "Les présentes Conditions d’utilisation (les « Conditions ») forment un contrat entre vous et GoCheque. Elles régissent l’accès à gocheque.ca et à l’application GoCheque (ensemble, les « Services »).\n\nEn créant un compte, en achetant des crédits, en cliquant sur Accepter dans notre bannière de confidentialité ou en utilisant les Services, vous acceptez ces Conditions et notre Politique de confidentialité. Si vous n’acceptez pas, n’utilisez pas les Services.\n\nGoCheque ne publie pas actuellement d’adresse civique dans ces Conditions. Avis officiels et questions juridiques : " +
    CONTACT +
    ".",
  sections: [
    {
      title: "1. Les Services",
      body:
        "GoCheque fournit un logiciel qui met en page des chèques bancaires canadiens selon un format inspiré de la norme CPA 006 et vous permet de les imprimer depuis le navigateur ou de télécharger un PDF sur les appareils pris en charge. Les Services sont destinés au dépôt mobile via l’application de votre institution financière.\n\nLes Services ne constituent pas : une banque, un processeur de paiement du chèque sous-jacent, un service de paiement de factures, un virement, ni une garantie qu’une institution acceptera un chèque. Nous ne vérifions pas les numéros de transit ou de compte, les bénéficiaires, les signatures ni votre autorisation de tirer sur un compte.\n\nLes chèques produits par impression à domicile sur papier ordinaire n’ont pas d’encre MICR magnétique. Bon nombre d’institutions les refuseront pour un dépôt en succursale, au GAB ou via le système de compensation. Les banques, caisses et leurs applications peuvent refuser un chèque pour tout motif qu’elles appliquent à leurs clients.",
    },
    {
      title: "2. Aucune garantie d’acceptation bancaire",
      body:
        "Vous reconnaissez que GoCheque ne garantit pas, ne déclare pas et n’assure pas qu’un chèque généré ou imprimé via les Services sera accepté, déposé, honoré ou payé par une institution financière, un processeur ou un bénéficiaire.\n\nLes règles de dépôt mobile, la qualité d’image, l’endossement, les délais de retenue, les filtres de fraude et les exigences de papier sont fixés par votre institution, non par GoCheque. Un refus, un délai, un retour ou une réclamation relève de votre relation avec votre banque. Nous n’en sommes pas responsables.",
    },
    {
      title: "3. Admissibilité et comptes",
      body:
        "Vous devez avoir au moins 18 ans et pouvoir contracter selon le droit de votre province ou territoire. Les Services sont offerts aux utilisateurs au Canada. Vous devez fournir des informations de compte exactes et les tenir à jour.\n\nVous êtes responsable de vos identifiants, de vos appareils d’authentification et de toute activité du compte. Avisez-nous sans délai à " +
        CONTACT +
        " en cas d’accès non autorisé suspecté.\n\nNous pouvons refuser, suspendre ou fermer un compte en cas de soupçon raisonnable de fraude, d’usage par un mineur ou de manquement aux présentes Conditions.",
    },
    {
      title: "4. Vos responsabilités pour chaque chèque",
      body:
        "Vous êtes seul responsable :\n\n• de l’exactitude de chaque champ du chèque ;\n• de votre autorisation légale d’émettre le chèque sur ce compte ;\n• du respect des règles de dépôt mobile et de chèque de votre institution ;\n• de la sécurité des chèques imprimés et des PDF ;\n• de tout litige, NSF, opposition ou réclamation découlant d’un chèque que vous créez.\n\nLe contenu du chèque est saisi et conservé sur votre appareil, sauf si vous choisissez de le transmettre. Nous n’archivons pas vos chèques sur nos serveurs.",
    },
    {
      title: "5. Usage acceptable",
      body:
        "Vous vous engagez à ne pas :\n\n• créer de faux chèques, de chèques falsifiés, altérés ou trompeurs, ni de chèques que vous n’êtes pas autorisé à émettre ;\n• utiliser les Services à des fins de blanchiment, de fraude ou de toute infraction criminelle ;\n• nuire à la sécurité ou à la disponibilité des Services ;\n• sonder, moissonner ou surcharger le site sans autorisation écrite ;\n• rétroconcevoir l’application sauf dans la mesure expressément permise par la loi ;\n• revendre l’accès aux Services ou aux crédits sauf autorisation expresse ;\n• téléverser des maliciels ou porter atteinte aux droits de propriété intellectuelle ou à la vie privée d’autrui.\n\nLa fraude par chèque est une infraction grave au Canada. Nous pouvons suspendre le compte sans remboursement, conserver des journaux et collaborer avec les institutions financières et les autorités.",
    },
    {
      title: "6. Crédits, tarifs, taxes et Stripe",
      body:
        "L’impression (le traitement) d’un chèque consomme un crédit, sauf indication contraire sur le site au moment de l’achat. Les crédits sont des biens numériques prépayés ajoutés à votre compte GoCheque après un paiement réussi.\n\nLes prix sont indiqués en dollars canadiens (CAD), sauf mention contraire. La TPS, la TVH, la TVQ ou d’autres taxes peuvent s’ajouter via Stripe selon les paramètres fiscaux disponibles et les informations de lieu.\n\nLes paiements sont traités par Stripe, Inc. et ses affiliés. Votre carte ou autre moyen de paiement est géré par Stripe ; GoCheque ne stocke pas les numéros complets sur ses serveurs. Les conditions et la politique de confidentialité de Stripe s’appliquent au paiement. Vous autorisez Stripe à facturer le forfait choisi, y compris les taxes calculées par Stripe.\n\nNous pouvons modifier les tarifs affichés. Lorsque la loi exige un préavis pour un achat futur, nous le fournirons. Un changement de tarif ne modifie pas les crédits déjà inscrits à votre compte.",
    },
    {
      title: "7. Remboursements et protection du consommateur",
      body:
        "Les crédits sont livrés immédiatement à votre compte lorsque le paiement réussit. Comme il s’agit de biens numériques dont l’exécution commence immédiatement, vous demandez cette exécution en concluant l’achat.\n\nEn règle générale, les crédits achetés sont non transférables et non remboursables une fois livrés, et nous ne remboursons pas les crédits inutilisés ni ceux déjà consommés par une impression. Nous examinerons un remboursement ou un crédit de remplacement lorsque : vous avez été facturé par erreur ou en double ; une défaillance technique imputable à GoCheque a empêché la livraison des crédits payés ; ou une loi impérative de protection du consommateur de votre province ou territoire vous confère un droit que nous devons respecter (y compris, le cas échéant, la Loi sur la protection du consommateur du Québec).\n\nLorsqu’un droit de résolution d’un contrat à distance pourrait autrement s’appliquer, il peut ne pas s’appliquer aux biens numériques fournis immédiatement à votre demande expresse et avec reconnaissance de la perte de ce droit — dans la mesure permise par la loi. Les droits impératifs auxquels vous ne pouvez pas renoncer demeurent.\n\nDemandes de remboursement : écrivez à " +
        CONTACT +
        " dans les 30 jours suivant le débit, à partir du courriel de votre compte, en indiquant le moment approximatif de l’achat. Les remboursements de carte approuvés sont effectués via Stripe vers le moyen de paiement d’origine. Une rétrofacturation peut entraîner la suspension du compte le temps de l’examen.",
    },
    {
      title: "8. Confidentialité",
      body:
        "Notre Politique de confidentialité explique le traitement des renseignements personnels, les témoins et l’emplacement des sous-traitants. Elle fait partie des présentes Conditions.",
    },
    {
      title: "9. Propriété intellectuelle",
      body:
        "Le site, le nom et le logo GoCheque, le logiciel et la documentation appartiennent à GoCheque ou à ses concédants. Nous vous accordons une licence limitée, révocable, non exclusive et non transférable pour utiliser les Services pour l’impression de vos propres chèques, personnels ou internes, conformément aux présentes Conditions.\n\nNous ne revendiquons pas la propriété du texte ou des images que vous inscrivez sur un chèque. Vous en êtes responsable.",
    },
    {
      title: "10. Services de tiers",
      body:
        "Les Services dépendent de Stripe, Supabase, Vercel et, si vous le choisissez, de la connexion Google. Une panne ou un changement de politique chez ces fournisseurs peut affecter GoCheque. Leurs conditions régissent votre utilisation de leurs services.",
    },
    {
      title: "11. Exclusion de garanties",
      body:
        "DANS LA MESURE MAXIMALE PERMISE PAR LA LOI, LES SERVICES SONT FOURNIS « TELS QUELS » ET « SELON LA DISPONIBILITÉ », SANS GARANTIE D’AUCUNE SORTE, EXPRESSE, IMPLICITE OU LÉGALE, Y COMPRIS LA QUALITÉ MARCHANDE, L’ADAPTATION À UN USAGE PARTICULIER, LE TITRE, LA JOUISSANCE PAISIBLE ET L’ABSENCE DE CONTREFAÇON.\n\nNOUS NE GARANTISSONS PAS QUE LES SERVICES SERONT ININTERROMPUS, EXEMPTS D’ERREURS OU SÉCURITAIRES, QUE LES CHÈQUES SATISFERONT AUX EXIGENCES TECHNIQUES DE CHAQUE INSTITUTION, NI QU’UNE BANQUE ACCEPTERA UN CHÈQUE.\n\nCertaines provinces n’autorisent pas certaines exclusions de garantie. Dans ces cas, l’exclusion s’applique seulement dans la mesure permise, et les garanties légales auxquelles on ne peut renoncer demeurent.",
    },
    {
      title: "12. Limitation de responsabilité",
      body:
        "DANS LA MESURE MAXIMALE PERMISE PAR LA LOI, GOCHEQUE AINSI QUE SES EXPLOITANTS, ADMINISTRATEURS ET FOURNISSEURS NE SERONT PAS RESPONSABLES DES DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX, CONSÉCUTIFS, EXEMPLAIRES OU PUNITIFS, NI DES PERTES DE PROFITS, DE REVENUS, DE DONNÉES, DE CLIENTÈLE OU D’INTERRUPTION D’ACTIVITÉS, MÊME S’ILS ONT ÉTÉ AVISÉS DE LA POSSIBILITÉ DE TELS DOMMAGES.\n\nNOTRE RESPONSABILITÉ TOTALE POUR TOUTE RÉCLAMATION LIÉE AUX SERVICES EST LIMITÉE AU MONTANT QUE VOUS AVEZ PAYÉ À GOCHEQUE POUR DES CRÉDITS AU COURS DES 12 MOIS PRÉCÉDANT LA RÉCLAMATION, OU À 50 $ CAD SI VOUS N’AVEZ RIEN PAYÉ DURANT CETTE PÉRIODE.\n\nCes limites ne s’appliquent pas à la responsabilité que le droit de votre province ne nous permet pas de limiter, y compris certains dommages causés par notre faute lourde ou notre dol lorsque cette règle s’applique, et elles ne limitent pas les droits auxquels un consommateur québécois ne peut renoncer.",
    },
    {
      title: "13. Indemnisation",
      body:
        "Vous défendrez et indemniserez GoCheque contre les réclamations, dommages et honoraires d’avocat raisonnables découlant de vos chèques, de votre compte, de votre violation des présentes Conditions ou de la loi, ou de votre atteinte aux droits d’un tiers, sauf dans la mesure causée par notre faute lourde ou notre dol.",
    },
    {
      title: "14. Suspension et résiliation",
      body:
        "Vous pouvez cesser d’utiliser les Services en tout temps. Nous pouvons suspendre ou résilier l’accès, avec un avis lorsque c’est raisonnablement possible, en cas de manquement aux présentes Conditions, d’annulation de paiement ou si nous cessons les Services.\n\nLes crédits inutilisés n’ont pas de valeur monétaire, sauf remboursement exigé par la loi ou accordé en vertu de l’article 7. Les dispositions qui doivent survivre (notamment les articles 2, 4, 5, 9, 11 à 13, 15 et 16) demeurent en vigueur.",
    },
    {
      title: "15. Droit applicable",
      body:
        "Les présentes Conditions sont régies par les lois du Canada et celles de la province ou du territoire où vous résidez, sans égard aux règles de conflit de lois qui désigneraient un autre droit, et sous réserve des règles impératives de protection du consommateur qui s’appliquent à vous.\n\nSi vous êtes un consommateur au Québec, rien dans les présentes Conditions ne limite les protections d’ordre public du Code civil du Québec ou de la Loi sur la protection du consommateur.",
    },
    {
      title: "16. Dispositions générales",
      body:
        "Si un tribunal juge une disposition inapplicable, le reste demeure en vigueur. Les présentes Conditions et la Politique de confidentialité constituent l’entente intégrale relative aux Services. Nous pouvons céder l’entente (par exemple lors d’une réorganisation) ; vous ne pouvez pas la céder sans notre consentement écrit.\n\nLe défaut d’appliquer une disposition n’emporte pas renonciation. Les titres sont fournis pour la commodité seulement.",
    },
    {
      title: "17. Contact",
      body:
        "Questions sur les présentes Conditions : " +
        CONTACT +
        ".\n\nTant qu’une adresse civique n’est pas publiée sur gocheque.ca, utilisez ce courriel pour les avis que vous êtes légalement tenu de nous transmettre.",
    },
  ],
};

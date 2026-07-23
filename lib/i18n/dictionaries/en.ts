import type { Dictionary } from "@/lib/i18n/dictionary-type";

export const dictionary = {
  meta: {
    homeTitle: "GoCheque — Canadian bank cheques, ready to print",
    homeDescription:
      "Generate and print CPA 006 compliant Canadian bank cheques for mobile deposit — not intended for in-branch deposit.",
    dashboardTitle: "Dashboard",
    dashboardDescription: "Manage your GoCheque print credits.",
  },
  nav: {
    editor: "Preview",
    preview: "Preview",
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    dashboard: "Dashboard",
    signIn: "Sign in",
    signOut: "Sign out",
    myAccount: "My account",
    myCredits: "My credits",
    editorDashboard: "Editor",
    accountSection: "Account",
    accountMenu: "Account menu",
    main: "Main navigation",
    skipToContent: "Skip to content",
    logoAlt: "GoCheque — Canadian bank cheques, ready to print",
  },
  locale: {
    switchToFr: "Français",
    switchToEn: "English",
    label: "Language",
  },
  hero: {
    logoAlt: "GoCheque — Canadian bank cheques, ready to print",
    titleBefore: "Canadian bank",
    titleHighlight: "cheques",
    titleAfter: "Ready to print",
    subtitle:
      "No special paper, no special ink, no complicated software.",
    depositNoticeLead: "Mobile deposit only.",
    depositNoticeRest: "Not intended for in-branch deposit.",
    ctaTry: "Try now",
    ctaPricing: "See pricing",
  },
  gallery: {
    sectionLabel: "Product preview",
    label: "Discover the GoCheque editor",
    items: {
      editor: "Cheque editor",
      preview: "Live preview",
      print: "CPA 006 printing",
      dashboard: "Dashboard",
    },
  },
  showcase: {
    sectionLabel: "GoCheque workflow",
    eyebrow: "Here are the steps to complete a cheque",
    scrollHint: "Scroll to continue",
    steps: [
      {
        word: "Fill",
        description: "Fill your banking details",
      },
      {
        word: "Print",
        description: "Print on standard paper",
      },
      {
        word: "Sign",
        description: "Sign your cheque",
      },
      {
        word: "Send",
        description: "Send it via mobile deposit",
      },
    ],
  },
  editor: {
    sectionLabel: "Cheque editor",
    formTitle: "Edit cheque",
    clear: "Clear",
    clearAriaLabel: "Clear the cheque and start a new entry",
    autofillNote:
      "Your browser may offer to save this information locally (like an address or card). GoCheque does not store it.",
    depositNotice:
      "These cheques are designed for mobile deposit (photo in your bank's app). They are not suitable for in-branch deposit or MICR ATM processing.",
    previewZoom: {
      open: "Enlarged cheque preview",
      title: "Cheque preview",
      hint: "Tap to enlarge",
      scrollHint: "Swipe in any direction to see the full cheque",
    },
    voidWatermark: "VOID",
    process: "PROCESS",
    processFootnoteCost: "1 credit will be debited to print this cheque.",
    processFootnoteBalance: "Current balance: {count} credit",
    processFootnoteBalancePlural: "Current balance: {count} credits",
    fields: {
      emitter: "Drawer",
      chqNum: "Cheque #",
      date: "Date",
      emitterAddr: "Drawer address",
      payee: "Payee",
      bankName: "Institution",
      bankAddr: "Institution address",
      amount: "Amount ($)",
      transit: "Transit",
      inst: "Inst.",
      account: "Account",
      memo: "Memo",
    },
    account: {
      editButton: "Edit # account",
      modalTitle: "MICR account layout",
      modalHint:
        "Use one of your cheque specimens to customize this cheque so it is compliant. Character 16 (⑆) is the fixed starting point — drag digits and dashes into the following slots.",
      modalHintTouch:
        "Use one of your cheque specimens to customize this cheque. Character 16 (⑆) is fixed — tap a symbol, then a slot to place it. Tap a placed character to move it.",
      gridLabel: "Specimen — account number (from character 16)",
      paletteLabel: "Symbols — drag into a slot",
      paletteLabelTouch: "Symbols — tap to select",
      tapStatusPalette: "Symbol {char} selected — tap a slot",
      tapStatusSlot: "Slot {slot} selected — tap destination",
      closeSlotLabel: "On-Us closing symbol (slot 16)",
      bankReservedSlotLabel: "Reserved — bank-printed transit",
      readingHint: "Positions numbered from the right edge of the cheque.",
      reset: "Clear all",
      cancel: "Cancel",
      apply: "Apply",
      slotChar: "Slot {slot}, character {char}",
      paletteChar: "Symbol {char}",
      removeSlot: "Remove {char}",
    },
    save: {
      ariaLabel: "Save cheque data in the browser",
      title: "Save",
      savedTitle: "Data saved",
      failedTitle: "Could not save",
      failedBody:
        "Your browser could not save the data locally. Check that local storage is not blocked.",
      body1:
        "Cheque fields are saved in your browser (on this device only). GoCheque does not receive or store this information on its servers.",
      body2:
        "On your next visit, your data will reload automatically to speed up entry.",
      lastSaved: "Last saved: {date}",
      confirm: "Got it",
    },
  },
  features: {
    items: [
      {
        title: "Mobile deposit",
        text: "Intended for mobile deposit only — print, photograph and deposit through your bank's mobile app.",
      },
      {
        title: "CPA 006 compliant",
        text: "Layout follows Canadian standards: dimensions, visual MICR band and E-13B format for mobile capture.",
      },
      {
        title: "Total privacy",
        text: "Your banking data never leaves your browser. No database stores your sensitive information.",
      },
      {
        title: "Affordable and instant",
        text: "Up to {percent}% cheaper than a paper cheque. Print in seconds — no ordering, no shipping wait.",
      },
    ],
  },
  pricing: {
    label: "Pricing",
    title: "Choose your plan",
    subtitle:
      "Pay only for what you use — each processed and printed cheque counts as one. An account is required to purchase.",
    paperChequeRef: "paper cheque",
    savingsVsPaper: "{percent}% cheaper than a {reference}",
    featureInstant: "Instant printing — no waiting",
    popular: "Popular",
    chequesUnit: "{count} cheques ~{price} each",
    featurePrintable: "{count} printable cheques",
    featureCpa: "CPA 006 compliant",
    choosePlan: "Choose this plan",
    signInToBuy: "Sign in to purchase",
    packages: {
      pack_starter: "Starter",
      pack_pro: "Pro",
      pack_volume: "Volume",
    },
    buyModal: {
      label: "Pricing",
      title: "Buy credits",
      subtitleEmpty:
        "No credits available — choose a plan to print your cheque.",
      subtitleDefault: "Choose a plan to get new credits.",
      connected: "Signed in: {email}",
      back: "← Back",
    },
  },
  faq: {
    label: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Everything you need to know before processing your first cheque.",
    items: [
      {
        id: "credits",
        question: "How do credits work?",
        answer:
          "Each credit lets you print one cheque once. You buy a plan, credits are added to your account, then debited automatically when you print.",
      },
      {
        id: "validite",
        question: "Do credits expire?",
        answer:
          "No. Your credit balance stays on your account with no expiry date. Use them whenever you need. Purchase and print history is available in your dashboard.",
      },
      {
        id: "donnees",
        question: "Is my banking information stored by GoCheque?",
        answer:
          "No. Data entered in the editor (account, transit, payee, etc.) stays in your browser. We do not store your cheques on our servers. Your browser may still offer to save this information locally, like an address or card.",
      },
      {
        id: "depot-mobile",
        question: "Can I deposit this cheque at a branch?",
        answer:
          "No. GoCheque produces cheques meant for mobile deposit: you print the cheque, then photograph it in your bank's app. Branch or ATM deposit usually requires cheque stock and a magnetic MICR band that home printing does not provide. Always check your institution's rules.",
      },
      {
        id: "cpa",
        question: "Are cheques CPA 006 compliant?",
        answer:
          "Layout follows CPA 006 dimensions, MICR band, E-13B format and front/back structure, adapted for mobile deposit. Printing on plain paper with a standard printer does not produce magnetic ink — these cheques do not replace MICR cheques for in-branch deposit.",
      },
      {
        id: "impression",
        question: "How do I print my cheque correctly?",
        answer:
          "Refer to the print guide on the cheque print page. It covers recommended settings, duplex printing and cutting — it appears when you start printing from the editor.",
      },
      {
        id: "compte",
        question: "Do I need an account to use GoCheque?",
        answer:
          "Yes. To prevent fraud and protect every transaction, each cheque is locked behind free account authentication. Purchasing credits, managing them and printing all require a secure sign-in — your credits are tied to your account.",
      },
      {
        id: "papier",
        question: "What paper should I use?",
        answer:
          "US Letter paper (8.5 × 11 in) is enough to print.",
      },
    ],
  },
  footer: {
    copyright: "© {year} GoCheque",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "Contact the GoCheque team by email.",
    title: "Contact",
    message: "To reach us, send an email to",
  },
  consent: {
    title: "Cookies and privacy",
    cookies:
      "We use essential cookies for language, session, and authentication.",
    terms: "By clicking Accept, you agree to our",
    and: "and our",
    accept: "Accept",
  },
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription:
      "GoCheque Privacy Policy — how we handle your personal information in Canada.",
    title: "Privacy Policy",
    lastUpdated: "Last updated: July 6, 2026",
    intro:
      "GoCheque is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights when you use our cheque generation and printing service for mobile deposit.",
    sections: [
      {
        title: "1. Data controller",
        body:
          "GoCheque operates gocheque.ca and is responsible for personal information collected through the Services, subject to applicable laws in Canada.",
      },
      {
        title: "2. Information we collect",
        body:
          "Account: email, account identifier, username (if provided), authentication information, and security preferences (e.g. two-factor authentication).\n\nTransactions: credit balance, purchase and credit consumption history, Stripe transaction identifiers.\n\nTechnical data: IP address, browser type, connection logs, and essential cookies (language, session).\n\nCommunications: messages you send us for support.",
      },
      {
        title: "3. Information we do not store",
        body:
          "Data entered in the cheque editor — account numbers, transit, institution, payee, amounts, signatures, etc. — is processed locally in your browser and is not retained on our servers for cheque storage.\n\nYour browser may still save these fields locally (local storage) or offer to remember them, independently of GoCheque.",
      },
      {
        title: "4. How we use your information",
        body:
          "We use your information to:\n\n• create and manage your account;\n• process credit purchases and provide the service;\n• secure access and prevent fraud;\n• respond to your requests;\n• comply with legal obligations;\n• improve service reliability and security.\n\nWe do not sell your personal information.",
      },
      {
        title: "5. Legal bases for processing",
        body:
          "We process your information based on contract performance (providing the service), your consent (where required), our legitimate interests (security, service improvement), and legal obligations, in accordance with applicable laws in Canada.",
      },
      {
        title: "6. Cookies and local storage",
        body:
          "Essential cookies: language preference, Supabase authentication session, and cookies required for Stripe payment when you make a purchase.\n\nLocal storage: cheque drafts and local technical identifiers may be stored in your browser for the editor to function.\n\nAudience measurement: we use Vercel Web Analytics and Speed Insights (our Site host) for traffic and performance statistics. These tools are designed to limit individual tracking and are not used for targeted advertising.\n\nWe do not use advertising cookies.",
      },
      {
        title: "7. Third-party services",
        body:
          "We use providers to operate the service:\n\n• Supabase — authentication and account database;\n• Stripe — payment processing;\n• Google — OAuth sign-in, if you choose that option.\n\nThese providers process information under their own privacy policies. We do not control their practices.",
      },
      {
        title: "8. Data retention",
        body:
          "We retain your account and purchase information as long as necessary to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements. You may request account deletion, subject to legal retention requirements.",
      },
      {
        title: "9. Security",
        body:
          "We apply reasonable technical and organizational measures to protect your information. However, no method of transmission or storage is completely secure. You are responsible for protecting your device, session, and data entered in the editor.",
      },
      {
        title: "10. Your rights",
        body:
          "Under applicable laws in Canada, you may have the right to access your information, request correction, withdraw consent (where processing is based on consent), or request deletion, subject to legal limits.\n\nTo exercise these rights, email info@gocheque.ca. We will respond within the timeframes required by applicable law.",
      },
      {
        title: "11. Children",
        body:
          "GoCheque is not intended for anyone under eighteen (18) years of age. We do not knowingly collect personal information from minors.",
      },
      {
        title: "12. Transfers and hosting",
        body:
          "Your information may be processed or hosted outside your province or Canada by our providers (for example, in the United States). In that case, your information may be subject to the local laws of those jurisdictions.",
      },
      {
        title: "13. Changes",
        body:
          "We may update this policy from time to time. The last updated date will be shown at the top of this page. Continued use of the service after publication constitutes acknowledgment of the revised policy.",
      },
      {
        title: "14. Contact",
        body:
          "For questions about this policy or your personal information, email info@gocheque.ca.",
      },
    ],
  },
  terms: {
    metaTitle: "Terms of Service",
    metaDescription:
      "GoCheque Terms of Service — Canadian cheque generation and printing for mobile deposit.",
    title: "Terms of Service",
    lastUpdated: "Last updated: July 6, 2026",
    intro:
      "This is a binding contract. Please read these terms carefully before using GoCheque.\n\nBy creating an account, purchasing credits, or using the service, you agree to be legally bound by these Terms of Service and any policies incorporated by reference. If you do not agree to these terms in their entirety, you must not use the service.",
    sections: [
      {
        title: "1. The Service",
        body:
          "GoCheque (\"we\", \"us\") operates gocheque.ca and provides an online application (the \"Site\" and \"Application\") that lets you generate and print Canadian bank cheques in CPA 006 format (the \"Services\"). The Services are intended for mobile deposit through your financial institution's app — not for in-branch or ATM deposit.\n\nGoCheque is a cheque layout and printing service, not a bill payment service, wire transfer service, or payment processor. We do not verify your transit or account numbers, payees, their addresses, or whether you are authorized to use a given bank account.",
      },
      {
        title: "2. Acceptance and Changes",
        body:
          "These terms take effect when you use the Services or create an account (the \"Effective Date\"). We may change these terms at any time. Material changes will be posted on this page with an updated date. Your continued use of the Services after publication constitutes acceptance of the revised terms. If you do not accept the modified terms, you must stop using the Services and may close your account.",
      },
      {
        title: "3. Eligibility",
        body:
          "The Services are not intended for children. You must be at least eighteen (18) years old to use GoCheque. If we determine that a user is under 18, we may terminate their access. The Services are for your own personal or business use; you may not resell, lease, or provide them to others except as expressly permitted.",
      },
      {
        title: "4. Privacy",
        body:
          "Your use of the Services is also governed by our Privacy Policy published on the Site. By using GoCheque, you consent to the collection and use of your personal information in accordance with that policy and applicable laws in Canada.",
      },
      {
        title: "5. Account Registration and Security",
        body:
          "To purchase credits and print cheques, you must create an account and provide true, accurate, current, and complete information. You must keep this information up to date.\n\nYou are responsible for keeping your login credentials secure and for all activity on your account. Notify us immediately of any unauthorized or suspected unauthorized use. You are responsible for all charges and actions taken through your account.\n\nYou must employ adequate security procedures to protect your banking information and prevent the issuance of unauthorized cheques.",
      },
      {
        title: "6. Acceptable Use",
        body:
          "When using the Services, you agree not to:\n\n• undermine the security or integrity of GoCheque's systems or those of its hosts;\n• use the Services in any way that impairs their operation or that of other users;\n• attempt unauthorized access to data or systems;\n• transmit illegal, offensive, harmful, or rights-infringing content;\n• copy, decompile, disassemble, or attempt to extract the Application's source code except as strictly permitted by law;\n• use robots, scrapers, or similar tools on the Site without written permission.\n\nWe may suspend or terminate your account for violations.",
      },
      {
        title: "7. Cheque Printing Services and Your Responsibilities",
        body:
          "Cheques are created from information you enter in your GoCheque account. You are solely responsible for the accuracy of that information, your authorization to issue each cheque, and compliance with your financial institution's rules.\n\nGoCheque does not track your cheques, payments, or bank accounts beyond what is necessary to provide the service (user account, credits, transaction history). We are not liable for the issuance, printing, or use of an unauthorized cheque, or for any rejected deposit, bank penalty, or financial loss arising therefrom.\n\nYou acknowledge that home printing on ordinary paper does not produce magnetic MICR ink and that the CPA 006 layout provided is adapted for mobile deposit, not branch deposit. GoCheque does not guarantee that your bank will accept a cheque printed through the service.",
      },
      {
        title: "8. Check Fraud Warning",
        body:
          "You may not use GoCheque to create fake, forged, deceptive, or fraudulent cheques. Cheque fraud is a serious offence in Canada and may result in civil and criminal prosecution.\n\nWe take fraud seriously and may monitor account activity through manual and automated means. If fraudulent activity is detected, we may immediately and permanently suspend your access, without refund, and cooperate with competent authorities. That decision is final.",
      },
      {
        title: "9. Credits, fees, taxes, and refunds",
        body:
          "Printing a cheque consumes one credit. Pricing is shown on the Site and may change. If prices change, we will endeavour to give you at least thirty (30) days' notice when required by law; your continued use after the effective date constitutes acceptance.\n\nCredits are purchased through Stripe, our third-party payment processor. Prices are quoted in Canadian dollars (CAD) unless otherwise stated. Applicable taxes (GST, QST, HST, etc.) may be added depending on your jurisdiction.\n\nRefund policy:\n• Credits are digital goods added to your account immediately after purchase.\n• Purchased credits are non-transferable and, as a general rule, non-refundable once delivered to your account.\n• No refund is provided for unused credits or for a credit already consumed by printing.\n• We may grant a refund or compensatory credit for a proven billing error, duplicate payment, or technical issue attributable to GoCheque, at our discretion and subject to applicable law.\n• For any refund request, contact info@gocheque.ca within thirty (30) days of purchase with your account email and transaction date.\n\nDespite care in describing the Services, typographical or pricing errors may occur; we reserve the right to correct them.",
      },
      {
        title: "10. Intellectual Property",
        body:
          "The Site, GoCheque brand, Application, interfaces, code, and all content provided by GoCheque (\"Content\") are protected by intellectual property laws. Except for the limited licence below, no rights are granted to you in that Content.\n\nCheque information you enter remains your responsibility. GoCheque does not claim ownership of your cheque content entered in the editor, which is processed locally in your browser.",
      },
      {
        title: "11. Limited Licence",
        body:
          "GoCheque grants you a limited, revocable, non-exclusive, non-transferable licence to access and use the Services in accordance with these terms, solely for your personal or internal business use. You may not modify, reproduce, distribute, or commercially exploit the Content without prior written permission. Unauthorized use may result in account termination.",
      },
      {
        title: "12. Service Availability and Security",
        body:
          "We use reasonable efforts to maintain a reliable and secure service. However, no system is perfectly secure or always available. The Internet has inherent risks and we cannot guarantee uninterrupted availability or absolute data security.\n\nBy using GoCheque, you accept these risks. You acknowledge that banking information entered in the editor is under your control in your browser and that you are responsible for protecting your device and session.",
      },
      {
        title: "13. Third-Party Services",
        body:
          "The Services may integrate or link to third-party services, including Stripe for payments and Supabase for authentication. Your use of those services is governed by their own terms and policies. GoCheque is not responsible for third-party services or their data practices.",
      },
      {
        title: "14. Disclaimer of Warranties",
        body:
          "TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICES AND CONTENT ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ERROR-FREE OPERATION, SECURITY, BANK ACCEPTANCE OF CHEQUES, OR COMPLIANCE WITH ANY LEGAL OBLIGATION ON YOUR PART.\n\nSome jurisdictions do not allow the exclusion of implied warranties; in that case, some exclusions may not apply to you.",
      },
      {
        title: "15. Limitation of Liability and Indemnity",
        body:
          "TO THE FULLEST EXTENT PERMITTED BY LAW, GOCHÈQUE AND ITS OPERATORS SHALL NOT BE LIABLE FOR INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR FOR LOSS OF PROFITS, DATA, REVENUE, OR GOODWILL, ARISING FROM USE OR INABILITY TO USE THE SERVICES.\n\nOur total cumulative liability for any claim relating to the Services is limited to the amount you paid to GoCheque in the twelve (12) months before the event giving rise to the claim.\n\nYou agree to defend, indemnify, and hold harmless GoCheque from any claim, loss, or expense (including reasonable legal fees) arising from your use of the Services, your cheques, your data, or any breach of these terms.",
      },
      {
        title: "16. Termination",
        body:
          "You may stop using the Services at any time. We may suspend or terminate your access, with or without notice, if you breach these terms, fraud is suspected, or for any other legitimate reason. Upon termination, provisions that by their nature should survive (liability, intellectual property, governing law) will remain in effect.",
      },
      {
        title: "17. Governing Law",
        body:
          "These terms are governed by the laws of Canada and the laws applicable in your province or territory of residence, subject to mandatory consumer protection provisions that may apply to you.",
      },
      {
        title: "18. General Provisions",
        body:
          "If any provision of these terms is held invalid or unenforceable, the remaining provisions remain in effect. These terms constitute the entire agreement between you and GoCheque regarding the Services and supersede any prior agreement on the same subject. GoCheque may assign its rights under these terms; you may not assign your rights without our prior written consent.",
      },
      {
        title: "19. Contact",
        body:
          "For questions about these terms, email info@gocheque.ca.",
      },
    ],
  },
  auth: {
    signOutConfirm: "Are you sure you want to sign out?",
    cancel: "Cancel",
    signingOut: "Signing out...",
    signOutAction: "Sign out",
    loginTitle: "Sign in",
    signupTitle: "Create account",
    loginSubtitle: "Access your account and view your credit balance.",
    signupSubtitle: "Create an account to save your credits.",
    email: "Email",
    pseudo: "Username",
    password: "Password",
    login: "Sign in",
    signup: "Sign up",
    google: "Continue with Google",
    noAccount: "No account?",
    hasAccount: "Already have an account?",
    createAccount: "Create account",
    signInLink: "Sign in",
    confirmEmail: "Confirm your email before signing in",
    invalidCredentials: "Incorrect email or password",
    loginFailed: "Sign-in failed. Try again.",
    signupSuccess:
      "Account created! Check your email to confirm, then sign in.",
    close: "Close",
    signupTab: "Sign up",
    signupLegalBefore: "I agree to the",
    signupLegalMiddle: "and the",
    signupLegalRequired:
      "You must accept the Terms of Service and Privacy Policy to create an account.",
    checkoutSubtitle: "Sign in to buy cheques.",
    traiterSubtitle: "Sign in to process your cheque.",
    loading: "Loading...",
    weakPassword: "Choose a stronger password.",
    googleError: "Google sign-in failed",
    back: "← Back",
    pseudoHint: "3–20 characters: letters, numbers, hyphen or underscore.",
    passwordStrengthLabel: "Password strength",
    passwordStrong: "Strong",
    passwordMedium: "Medium",
    passwordWeak: "Weak",
    passwordRules: {
      length: "At least 8 characters",
      upper: "One uppercase letter",
      lower: "One lowercase letter",
      digit: "One number",
      special: "One special character (!@#$%...)",
    },
    mfaLoginTitle: "Two-step verification",
    mfaLoginSubtitle:
      "Enter the 6-digit code from your authenticator app.",
    mfaLoginVerify: "Verify",
    mfaLoginFailed: "Incorrect code. Try again.",
    mfaSignupOfferTitle: "Secure your account (optional)",
    mfaSignupOfferSubtitle:
      "Add two-factor authentication to better protect your account. You can also enable it later in My account.",
    mfaSignupEnable: "Enable 2FA",
    mfaSignupSkip: "Skip for now",
  },
  process: {
    title: "Process cheque",
    titleCheque: "Process your cheque",
    subtitleCredits:
      "1 credit will be debited automatically to print this cheque.",
    subtitleNoCredits:
      "You have no credits left — buy a plan to continue.",
    currentBalance: "Current balance",
    oneCreditOnePrint: "1 credit = 1 print",
    print: "Print cheque",
    noCredits: "No credits available.",
    buyCredits: "Buy credits",
    consumeGeneric: "Could not debit a credit",
    subtitleCreditsTouch:
      "1 credit will be debited. On mobile, you'll download a print-ready PDF.",
    printTouch: "Continue",
    mobilePrint: {
      title: "Print-ready PDF",
      intro:
        "Get ready to download your cheque as a PDF for quick printing.",
      step1: 'Tap "Download PDF".',
      step2:
        "Open the file in Files / Drive, then print at 100% with no margins (AirPrint or other).",
      step3:
        "Cut below the dashed line, then photograph the cheque in your bank's deposit app.",
      generateButton: "Download PDF",
      generating: "Generating PDF…",
      successTitle: "PDF ready",
      successIntro:
        "The file was downloaded. You can download again or share it (AirDrop, Messages, Print…).",
      downloadButton: "Download again",
      shareButton: "Share…",
      shareText: "GoCheque cheque — print-ready PDF",
      shareError: "Sharing failed. Use download instead.",
      generateError:
        "Could not generate the PDF. Return to the editor and try again.",
      close: "Close",
    },
  },
  credits: {
    purchaseTitle: "Credits added",
    purchaseAdded: "{count} credit added to your account",
    purchaseAddedPlural: "{count} credits added to your account",
    balance: "{count} credit available",
    balancePlural: "{count} credits available",
    continue: "Continue",
    validityNote: "Credits are added to your account balance.",
    insufficient: "Insufficient credits — buy a plan.",
    listTitle: "My credits",
    listSubtitle: "Balance and transaction history",
    loading: "Loading your credits...",
    empty: "No credits yet",
    emptyFilter: "No transactions in this category.",
    filterAll: "All",
    filterPurchases: "Purchases",
    filterUses: "Prints",
    emptyBuyHint: "Buy a plan from the cheque editor.",
    retry: "Retry",
    loadMore: "Load more",
    remaining: "({count} remaining)",
    remainingPlural: "({count} remaining)",
    statsBalance: "Balance",
    statsPurchased: "Purchased",
    statsUsed: "Used",
    loadError: "Could not load credits",
    txnPurchase: "Purchase — {count} credit",
    txnPurchasePlural: "Purchase — {count} credits",
    txnConsume: "Print — {count} credit",
    txnConsumePlural: "Print — {count} credits",
    txnMigration: "Migration from legacy system",
    txnAdjustment: "Balance adjustment",
    txnDate: "{date}",
    txnBalanceAfter: "New balance: {balance}",
    viewInvoices: "View my invoices",
    invoicesHint:
      "View your Stripe invoices and receipts in the secure payment portal.",
    invoicesError: "Could not open the Stripe invoice portal.",
  },
  dashboard: {
    label: "Dashboard",
    navLabel: "Dashboard navigation",
    greeting: "Hello, {name}",
    defaultUser: "User",
    editorTitle: "Cheque editor",
    editorSubtitle:
      "Fill in your cheque, process it and print it from your account.",
    createCheque: "Create a cheque",
    createChequeDesc:
      "Open the editor to fill in, process and print a new cheque.",
    openEditor: "Open editor →",
    creditsAvailable:
      "{count} credit available to print",
    creditsAvailablePlural:
      "{count} credits available to print",
  },
  account: {
    title: "My account",
    subtitle: "Manage your profile and account security.",
    collapseAll: "Close all sections",
    profileTitle: "Profile",
    profileDescription: "Your identity and email address.",
    changePassword: "Change password",
    passwordDescription: "Confirm your current password before choosing a new one.",
    currentPassword: "Current password",
    currentPasswordInvalid: "Current password is incorrect.",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    passwordMismatch: "Passwords do not match.",
    savePassword: "Save password",
    saveProfile: "Save profile",
    passwordUpdated: "Password updated successfully.",
    passwordUpdateFailed: "Could not update password.",
    profileUpdated: "Profile updated successfully.",
    profileUpdateFailed: "Could not update profile.",
    securityTitle: "Two-factor authentication",
    securityDescription:
      "Protect your account with an authenticator app (Google Authenticator, Authy, etc.).",
    mfaStatusEnabled: "Enabled",
    mfaStatusDisabled: "Not set up",
    mfaEnable: "Set up 2FA",
    mfaDisable: "Disable 2FA",
    mfaScanQr:
      "Scan this QR code with your authenticator app, then enter the 6-digit code.",
    mfaEnterCode: "6-digit code",
    mfaVerify: "Verify and enable",
    mfaCancel: "Cancel",
    mfaEnrollFailed: "Could not start 2FA setup.",
    mfaVerifyFailed: "Incorrect code. Try again.",
    mfaEnabledSuccess: "Two-factor authentication enabled.",
    mfaDisabledSuccess: "Two-factor authentication disabled.",
    mfaDisableFailed: "Could not disable 2FA.",
    mfaLoading: "Loading security settings…",
  },
  notFound: {
    code: "404",
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist or has been moved. Check the address or return to the home page.",
    backHome: "Back to home",
    backDashboard: "Dashboard",
    metaTitle: "Page not found",
    metaDescription: "This page does not exist on GoCheque.",
  },
  common: {
    close: "Close",
    scrollToTop: "Back to top",
    or: "or",
    loading: "Loading...",
    error: "Error",
    errorPurchase: "Purchase error",
  },
  anchors: {
    gallery: "preview",
    editor: "preview",
    features: "features",
    pricing: "pricing",
    faq: "faq",
  },
} satisfies Dictionary;

import type { LegalDocument } from "@/lib/legal/types";

const CONTACT = "info@gocheque.ca";

export const privacyEn: LegalDocument = {
  metaTitle: "Privacy Policy — GoCheque",
  metaDescription:
    "GoCheque Privacy Policy — how we collect, use, and protect personal information in Canada, including PIPEDA and Quebec Law 25 rights.",
  title: "Privacy Policy",
  lastUpdated: "Last updated: August 28, 2026",
  intro:
    "GoCheque (“we”, “us”) operates gocheque.ca and gocheque.com and provides an online service to generate and print Canadian bank cheques for mobile deposit. This policy explains how we handle personal information.\n\nWe designed the product so cheque contents (account numbers, transit, payee, amounts, and similar fields) stay in your browser. Account, billing, and security data needed to run the service are stored with our processors.\n\nGoCheque does not currently publish a civic business address in this policy. For privacy requests, write to " +
    CONTACT +
    ". We will identify the organization and, where required by law, the privacy officer responsible for your request.",
  sections: [
    {
      title: "1. Who we are and scope",
      body:
        "This policy applies to personal information collected through gocheque.ca, gocheque.com, the GoCheque application, related emails, and our support channel.\n\nGoCheque is a Canadian software service. We process personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and, for residents of Quebec, Law 25 (an Act to modernize legislative provisions as regards the protection of personal information, including the Act respecting the protection of personal information in the private sector). Other provincial privacy laws may also apply depending on where you live.\n\nWe do not sell personal information.",
    },
    {
      title: "2. Personal information we collect",
      body:
        "Account and identity: email address, account identifier, optional username (pseudo), authentication credentials, and two-factor authentication settings if you enable them. If you sign in with Google, we receive the identifiers Google provides for that sign-in.\n\nBilling and credits: credit balance, purchase and consumption history, Stripe customer and transaction identifiers, and the information Stripe needs to charge you (processed by Stripe, not stored as full card numbers on GoCheque servers).\n\nTechnical and security: IP address, browser and device type, approximate connection metadata, logs used to operate and secure the service, language preference, and session tokens.\n\nCommunications: emails or messages you send to " +
        CONTACT +
        ".\n\nWe do not ask for your social insurance number, and we do not require a civic address to create an account.",
    },
    {
      title: "3. Information we do not store on our servers",
      body:
        "Cheque editor contents — including drawer and payee names, addresses you type on the cheque, bank transit and institution numbers, account numbers, serial numbers, amounts, memo lines, and signature images — are processed locally in your browser for layout and printing. They are not uploaded to GoCheque servers for storage of cheques.\n\nYour browser may keep drafts in local storage on that device, or offer to autofill fields. That storage is under your control. Clearing site data on the device removes those local drafts.\n\nPrinting on your device (including generating a PDF on the device) happens on the device. We do not receive a copy of the printed cheque.",
    },
    {
      title: "4. How we use personal information",
      body:
        "We use personal information to:\n\n• create and administer your account;\n• authenticate you and protect the account (including optional two-factor authentication);\n• sell, deliver, and account for print credits, and to process payments via Stripe;\n• prevent fraud, abuse, and unauthorized use of the service;\n• provide customer support and respond to legal requests;\n• operate, secure, and improve the reliability of the site (including limited analytics described below);\n• send transactional messages (for example, email confirmation, password reset, purchase receipts) that are required to provide the service;\n• comply with Canadian law.\n\nWe do not use your cheque contents for advertising. We do not build marketing profiles from cheque data, because that data is not stored on our servers.",
    },
    {
      title: "5. Legal bases and Quebec (Law 25)",
      body:
        "We collect, use, and disclose personal information only for the purposes described in this policy, or purposes that are consistent with them, as permitted by law.\n\nDepending on the context, processing is based on: performance of our contract with you (providing the service you request); your consent (for example, creating an account and accepting this policy); our legitimate needs to secure the service and prevent fraud; and legal obligations.\n\nIf you are in Quebec, we additionally comply with Law 25, including the requirement to identify the purposes of collection, limit collection to what is necessary, and maintain governance measures appropriate to the sensitivity of the information. Cheque banking details are sensitive; that is why they remain on your device.\n\nYou may withdraw consent where processing is based on consent, subject to legal or contractual restrictions (for example, we may still retain records required for tax, dispute, or fraud prevention). Withdrawing consent may mean we cannot continue to provide the account.",
    },
    {
      title: "6. Cookies, local storage, and similar technologies",
      body:
        "We use strictly necessary cookies and similar technologies:\n\n• Language: to remember French or English.\n• Session and authentication: so you stay signed in securely (Supabase). These are required for the account to function.\n• Payment: when you buy credits, Stripe may set cookies required to complete checkout and prevent payment fraud.\n\nLocal storage on your device may hold cheque drafts and a record that you accepted this policy and the Terms of Use.\n\nAnalytics: we use Vercel Web Analytics and Speed Insights, provided by our host, to understand traffic and performance. These tools are configured to limit advertising-style tracking. We do not use third-party advertising cookies or sell data to ad networks.\n\nYou can refuse non-essential cookies in your browser. Blocking strictly necessary cookies will prevent sign-in and checkout from working.",
    },
    {
      title: "7. CASL and electronic messages",
      body:
        "Canada’s Anti-Spam Legislation (CASL) applies to commercial electronic messages. We send transactional and relationship messages needed to operate your account (security, receipts, service notices).\n\nWe do not send promotional email campaigns unless we have the consent CASL requires. If we ever send commercial electronic messages, they will identify GoCheque, include " +
        CONTACT +
        " as a contact, and provide an unsubscribe mechanism. You can also email " +
        CONTACT +
        " to opt out of optional commercial messages.",
    },
    {
      title: "8. Service providers",
      body:
        "We use processors to operate GoCheque:\n\n• Supabase — authentication, account database, and related hosting.\n• Stripe — payment processing, invoices, tax calculation where configured, and customer billing portal.\n• Google — only if you choose “Continue with Google” for sign-in.\n• Vercel — website hosting, analytics, and performance measurement.\n\nThese providers process information under their own terms and privacy policies. We require them, by contract where applicable, to use the information only to provide their services to us. We do not control their independent practices.",
    },
    {
      title: "9. Transfers outside your province or Canada",
      body:
        "Our processors may store or access information in the United States or other countries. When information leaves Canada, it may be subject to the laws of that jurisdiction, including lawful access by foreign authorities.\n\nWe use reputable providers and contractual safeguards appropriate to the service. By using GoCheque, you understand that account and billing data may be processed outside Quebec and outside Canada.",
    },
    {
      title: "10. Retention",
      body:
        "We keep account, credit, and transaction records for as long as the account is active and for a reasonable period afterwards as needed for accounting, tax, dispute resolution, security, and legal compliance.\n\nLocal cheque drafts remain on your device until you clear them.\n\nWhen information is no longer required, we destroy or de-identify it through reasonable means.",
    },
    {
      title: "11. Security",
      body:
        "We use reasonable administrative, technical, and physical safeguards appropriate to a hosted software service, including encrypted transport (HTTPS), access controls, and authentication options including two-factor authentication.\n\nNo method of transmission or storage is perfectly secure. You are responsible for the security of your device, password, authenticator app, and any cheque data stored locally or printed.",
    },
    {
      title: "12. Confidentiality incidents",
      body:
        "If we experience a confidentiality incident involving personal information that presents a risk of serious injury, we will notify the Commission d’accès à l’information du Québec when Quebec law requires it, notify the federal Privacy Commissioner of Canada when PIPEDA requires it, and notify affected individuals as required by applicable law. You may also write to " +
        CONTACT +
        " if you believe your information has been compromised.",
    },
    {
      title: "13. Automated processing and profiling",
      body:
        "We may use automated or manual reviews to detect fraud, unpaid chargebacks, or abuse of print credits. We do not make automated decisions that grant or deny loans, credit, or employment. We do not use cheque images or cheque field contents for profiling, because we do not store them on our servers.",
    },
    {
      title: "14. Your rights (Canada and Quebec)",
      body:
        "Subject to legal limits, you may request to:\n\n• access the personal information we hold about you;\n• correct inaccurate or incomplete information;\n• withdraw consent where processing is based on consent;\n• request deletion of your account and associated personal information;\n• be informed of the categories of information we hold and how it is used.\n\nQuebec residents may also exercise rights provided by Law 25, including the right to request information about our privacy practices and, where applicable, data portability in a structured format when the law so requires.\n\nTo exercise these rights, email " +
        CONTACT +
        " from the address on your account and describe your request. We may need to verify your identity. We will respond within the time required by applicable law (generally 30 days, subject to permitted extensions).\n\nYou may complain to the Office of the Privacy Commissioner of Canada or, if you are in Quebec, to the Commission d’accès à l’information du Québec.",
    },
    {
      title: "15. Children",
      body:
        "GoCheque is for adults. You must be at least 18. We do not knowingly collect personal information from minors. If we learn that we have an account for a person under 18, we will close it and delete associated information except where the law requires retention.",
    },
    {
      title: "16. Changes",
      body:
        "We may update this policy. The date at the top will change. If we make material changes, we will present the updated policy on the site. Where the law requires a new consent, we will ask for it (including by refreshing the cookie and privacy banner). Continued use after the effective date, where permitted, constitutes acknowledgment of the revised policy.",
    },
    {
      title: "17. Contact and privacy officer",
      body:
        "Privacy requests, questions, and complaints: " +
        CONTACT +
        ".\n\nPlease put “Privacy” in the subject line.\n\nGoCheque has not published a civic address or a named privacy officer in this policy. Until those details are published on the site, write to the email above. We will route your request to the person responsible for the protection of personal information and will provide identification details required by law in our response.\n\nThis is not a substitute for obtaining independent legal advice.",
    },
  ],
};

export const termsEn: LegalDocument = {
  metaTitle: "Terms of Use — GoCheque",
  metaDescription:
    "GoCheque Terms of Use — Canadian cheque layout and printing for mobile deposit, accounts, credits, Stripe billing, and acceptable use.",
  title: "Terms of Use",
  lastUpdated: "Last updated: August 28, 2026",
  intro:
    "These Terms of Use (the “Terms”) are a contract between you and GoCheque. They govern access to gocheque.ca, gocheque.com, and the GoCheque application (together, the “Services”).\n\nBy creating an account, buying credits, clicking Accept on our privacy banner, or using the Services, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Services.\n\nGoCheque does not currently publish a civic business address in these Terms. Official notices and legal questions: " +
    CONTACT +
    ".",
  sections: [
    {
      title: "1. The Services",
      body:
        "GoCheque provides software that lays out Canadian bank cheques in a CPA 006-inspired format and lets you print them from your browser or download a PDF on supported devices. The Services are intended for mobile deposit through your financial institution’s app.\n\nThe Services are not: a bank, a payment processor for the underlying cheque, a bill-pay product, a wire service, or a guarantee that any institution will accept a cheque. We do not verify transit numbers, account numbers, payees, signatures, or your authority to draw on an account.\n\nCheques produced with home printing on ordinary paper do not carry magnetic MICR ink. Many institutions will not accept them for in-branch, ATM, or clearing-house deposit. Banks, credit unions, and their apps may reject a cheque for any reason they apply to their customers.",
    },
    {
      title: "2. No warranty of bank acceptance",
      body:
        "You acknowledge and agree that GoCheque does not warrant, represent, or guarantee that any cheque generated or printed through the Services will be accepted, deposited, honoured, or paid by any financial institution, payment processor, or payee.\n\nMobile-deposit rules, image quality, endorsement, hold periods, fraud filters, and paper requirements are set by your institution, not by GoCheque. A rejection, delay, returned item, or claim is your relationship with your bank. We are not liable for those outcomes.",
    },
    {
      title: "3. Eligibility and accounts",
      body:
        "You must be at least 18 years old and able to form a binding contract under the law of your province or territory. The Services are offered to users in Canada. You must provide accurate account information and keep it current.\n\nYou are responsible for credentials, two-factor devices, and all activity on the account. Notify us promptly at " +
        CONTACT +
        " if you suspect unauthorized access.\n\nWe may refuse, suspend, or close accounts where we reasonably suspect fraud, underage use, or a breach of these Terms.",
    },
    {
      title: "4. Your responsibilities for each cheque",
      body:
        "You are solely responsible for:\n\n• the accuracy of every field on the cheque;\n• your legal authority to issue the cheque on that account;\n• compliance with your institution’s mobile-deposit and cheque rules;\n• keeping printed cheques and PDFs secure;\n• any dispute, NSF, stop payment, or claim arising from a cheque you create.\n\nCheque contents are entered and stored on your device unless you choose to share them. We do not archive your cheques on our servers.",
    },
    {
      title: "5. Acceptable use",
      body:
        "You agree not to:\n\n• create fake, forged, altered, or deceptive cheques, or cheques you are not authorized to issue;\n• use the Services for money laundering, fraud, or any criminal offence;\n• interfere with the security or availability of the Services;\n• probe, scrape, or overload the site without our written permission;\n• reverse engineer the application except as a law expressly allows;\n• resell access to the Services or credits except as we expressly permit;\n• upload malware or infringe others’ intellectual property or privacy rights.\n\nCheque fraud is a serious offence in Canada. We may suspend the account without refund, preserve logs, and cooperate with financial institutions and law enforcement.",
    },
    {
      title: "6. Credits, pricing, taxes, and Stripe",
      body:
        "Printing (processing) a cheque consumes one credit, unless we state otherwise on the site at the time of purchase. Credits are prepaid digital goods added to your GoCheque account after successful payment.\n\nPrices are shown in Canadian dollars (CAD) unless marked otherwise. Applicable GST, HST, QST, or other taxes may be added by Stripe based on available tax settings and your location information.\n\nPayments are processed by Stripe, Inc. and its affiliates. Your card or other payment method is handled by Stripe, not stored in full on GoCheque servers. Stripe’s terms and privacy policy apply to the payment. You authorize Stripe to charge the selected package, including taxes Stripe calculates.\n\nWe may change list prices. When the law requires advance notice of a price change for a future purchase, we will provide it. A price change does not alter credits already on your account.",
    },
    {
      title: "7. Refunds and consumer protection",
      body:
        "Credits are delivered immediately to your account when payment succeeds. Because they are digital goods whose performance begins at once, you request immediate performance by completing checkout.\n\nAs a general rule, purchased credits are non-transferable and non-refundable once delivered, and we do not refund unused credits or credits already consumed by a print. We will consider a refund or a replacement credit where: you were charged in error or twice; a technical failure attributable to GoCheque prevented delivery of credits you paid for; or a mandatory consumer-protection law in your province or territory gives you a right we must honour (including, where applicable, the Quebec Consumer Protection Act).\n\nWhere a distance-contract withdrawal right could otherwise apply, it may not apply to digital goods supplied immediately with your express request and acknowledgment that you lose that right — to the extent the law allows. Mandatory rights you cannot waive remain available.\n\nRefund requests: email " +
        CONTACT +
        " within 30 days of the charge, from your account email, with the approximate time of purchase. Approved card refunds are issued through Stripe to the original payment method. Chargebacks may lead us to suspend the account pending review.",
    },
    {
      title: "8. Privacy",
      body:
        "Our Privacy Policy explains how we handle personal information, cookies, and processor locations. It forms part of these Terms.",
    },
    {
      title: "9. Intellectual property",
      body:
        "The site, GoCheque name and logo, software, and documentation are owned by GoCheque or its licensors. We grant you a limited, revocable, non-exclusive, non-transferable licence to use the Services for your own personal or internal business cheque printing, in line with these Terms.\n\nWe do not claim ownership of the text or images you type or draw onto a cheque. You are responsible for that content.",
    },
    {
      title: "10. Third-party services",
      body:
        "The Services depend on Stripe, Supabase, Vercel, and, if you choose it, Google sign-in. Outages or policy changes at those providers can affect GoCheque. Their terms govern your use of their services.",
    },
    {
      title: "11. Disclaimer of warranties",
      body:
        "TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, AND NON-INFRINGEMENT.\n\nWE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, THAT CHEQUES WILL MATCH EVERY INSTITUTION’S TECHNICAL REQUIREMENTS, OR THAT ANY BANK WILL ACCEPT A CHEQUE.\n\nSome provinces do not allow certain warranty exclusions. In those places, the exclusion applies only to the extent permitted, and statutory warranties you cannot waive remain.",
    },
    {
      title: "12. Limitation of liability",
      body:
        "TO THE FULLEST EXTENT PERMITTED BY LAW, GOCHEQUE AND ITS OPERATORS, DIRECTORS, AND SUPPLIERS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY.\n\nOUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF THE SERVICES IS LIMITED TO THE AMOUNT YOU PAID TO GOCHEQUE FOR CREDITS IN THE 12 MONTHS BEFORE THE CLAIM, OR $50 CAD IF YOU HAVE NOT PAID IN THAT PERIOD.\n\nThese limits do not apply to liability that the law of your province does not allow us to limit, including certain damages caused by our gross negligence or willful misconduct where that rule applies, and they do not limit rights that Quebec consumers cannot waive.",
    },
    {
      title: "13. Indemnity",
      body:
        "You will defend and indemnify GoCheque against claims, damages, and reasonable legal fees arising from your cheques, your account, your violation of these Terms or of law, or your infringement of a third party’s rights, except to the extent caused by our gross negligence or willful misconduct.",
    },
    {
      title: "14. Suspension and termination",
      body:
        "You may stop using the Services at any time. We may suspend or terminate access, with notice where reasonably practical, if you breach these Terms, if payment is reversed, or if we discontinue the Services.\n\nUnused credits have no cash value except where a refund is required by law or granted under section 7. Provisions that should survive (including sections 2, 4, 5, 9, 11–13, 15, and 16) remain in effect.",
    },
    {
      title: "15. Governing law",
      body:
        "These Terms are governed by the laws of Canada and the laws of the province or territory in which you reside, without regard to conflict-of-law rules that would apply another law, and subject to mandatory consumer-protection rules that apply to you.\n\nIf you are a consumer in Quebec, nothing in these Terms limits the public-order protections of the Civil Code of Québec or the Consumer Protection Act.",
    },
    {
      title: "16. General",
      body:
        "If a court finds a provision unenforceable, the rest remains in force. These Terms and the Privacy Policy are the entire agreement for the Services. We may assign the agreement (for example, in a reorganization); you may not assign it without our written consent.\n\nA failure to enforce a provision is not a waiver. Headings are for convenience only.",
    },
    {
      title: "17. Contact",
      body:
        "Questions about these Terms: " +
        CONTACT +
        ".\n\nUntil a civic address is published on the site, use that email for notices you are legally required to send us.",
    },
  ],
};

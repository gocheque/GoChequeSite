export type LegalSection = {
  title: string;
  body: string;
};

export type LegalDocument = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

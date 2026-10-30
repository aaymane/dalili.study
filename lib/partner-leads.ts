// Partnership requests (dalili.study/partenaires → public.partner_leads). One list of organisation types and
// statuses for the public form, the API route and the admin tab; it must match the checks in dalili-app
// supabase/migrations/20261030230000_partenaires.sql.

export const PARTNER_KINDS = ['banque', 'ecole', 'assurance', 'logement', 'mobilite', 'association', 'autre'] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number];

export const PARTNER_KIND_LABEL: Record<PartnerKind, string> = {
  banque: 'Banque',
  ecole: 'École / université',
  assurance: 'Assurance / mutuelle',
  logement: 'Logement',
  mobilite: 'Mobilité / télécom',
  association: 'Association / institution',
  autre: 'Autre',
};

export const isPartnerKind = (v: string): v is PartnerKind => (PARTNER_KINDS as readonly string[]).includes(v);

export const PARTNER_STATUSES = ['nouveau', 'en_cours', 'partenaire', 'sans_suite'] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  nouveau: 'Nouvelle',
  en_cours: 'En discussion',
  partenaire: 'Devenu partenaire',
  sans_suite: 'Sans suite',
};

export const isPartnerStatus = (v: unknown): v is PartnerStatus => (PARTNER_STATUSES as readonly unknown[]).includes(v);

/** Limits shared by the form (maxLength) and the server (truncation); same as the table checks. */
export const PARTNER_LIMITS = {
  organization: 120,
  contactName: 80,
  jobTitle: 80,
  email: 160,
  phone: 30,
  website: 200,
  zone: 80,
  message: 2000,
  /** The server refuses shorter messages. */
  messageMin: 10,
} as const;

/**
 * How each type is shown on the public page: its colour (RGB, for the dot, the chip and the hover), an example of
 * what it brings to students, and the step of the student journey where it appears.
 */
export const PARTNER_KIND_INFO: Record<Exclude<PartnerKind, 'autre'>, { title: string; rgb: string; offer: string; moment: string }> = {
  banque: { title: 'Banques et néobanques', rgb: '77,143,255', offer: 'Ouvrir un compte dès l’arrivée, souvent avant d’avoir une adresse en France.', moment: 'Étape banque' },
  ecole: { title: 'Écoles et universités', rgb: '167,139,250', offer: 'Être découvertes par des étudiants qui construisent leur projet d’études en France.', moment: 'Avant Campus France' },
  assurance: { title: 'Assurances et mutuelles', rgb: '52,211,153', offer: 'Habitation, responsabilité civile, complémentaire santé : les obligations des premières semaines.', moment: 'Visa, puis arrivée' },
  logement: { title: 'Logement', rgb: '239,179,112', offer: 'Trouver où vivre à distance, souvent sans garant en France.', moment: 'Avant le départ' },
  mobilite: { title: 'Mobilité et télécom', rgb: '34,211,238', offer: 'Forfait mobile, transports, permis : le quotidien à mettre en place vite.', moment: 'Jour de l’arrivée' },
  association: { title: 'Associations et institutions', rgb: '244,114,182', offer: 'Accueil, accompagnement, vie étudiante : faire connaître ce qui existe déjà.', moment: 'Premiers mois' },
};

/** The colour of a type ('autre' gets the DALILI blue). */
export const partnerKindRgb = (k: PartnerKind) => (k === 'autre' ? '143,180,255' : PARTNER_KIND_INFO[k].rgb);

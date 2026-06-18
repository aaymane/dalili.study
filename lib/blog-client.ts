export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  category: string;
  readTime: string;
  excerpt: string;
  author: string;
  ogImage?: string;
  thumbnail?: string;
  cluster?: string;
}

export const CLUSTER_DEFINITIONS: Record<string, { label: string; description: string; color: string; accentRgb: string }> = {
  'visa':          { label: 'Visa & Campus France', description: 'Visa étudiant et procédure Campus France', color: '#4d8fff', accentRgb: '77,143,255' },
  'logement':      { label: 'Logement',             description: 'CROUS, garant, recherche depuis l\'étranger', color: '#EFB370', accentRgb: '239,179,112' },
  'banque':        { label: 'Banque & Budget',       description: 'Compte bancaire, budget mensuel', color: '#22C55E', accentRgb: '34,197,94' },
  'aides':         { label: 'Aides & Bourses',       description: 'CAF, APL, bourses d\'études', color: '#E879F9', accentRgb: '232,121,249' },
  'emploi':        { label: 'Emploi & Stage',        description: 'Travailler en France, alternance, stage', color: '#F59E0B', accentRgb: '245,158,11' },
  'vie-etudiante': { label: 'Vie Étudiante',         description: 'Université, transport, vie en France', color: '#06B6D4', accentRgb: '6,182,212' },
  'sante':         { label: 'Santé',                 description: 'Sécurité sociale, médecin traitant', color: '#F43F5E', accentRgb: '244,63,94' },
  'demarches':     { label: 'Démarches',             description: 'Titre de séjour, OFII, renouvellement', color: '#A855F7', accentRgb: '168,85,247' },
  'algerie':       { label: 'Depuis l\'Algérie',     description: 'Campus France Algérie, visa, vie étudiante', color: '#34D399', accentRgb: '52,211,153' },
  'senegal':       { label: 'Depuis le Sénégal',     description: 'Campus France Sénégal, visa, bourses', color: '#FB923C', accentRgb: '251,146,60' },
  'maroc':         { label: 'Depuis le Maroc',       description: 'TCF, Campus France Maroc, visa étudiant', color: '#C8102E', accentRgb: '200,16,46' },
};

export const CATEGORY_COLORS: Record<string, { accent: string; accentRgb: string }> = {
  Banque:         { accent: '#22C55E', accentRgb: '34,197,94' },
  Logement:       { accent: '#EFB370', accentRgb: '239,179,112' },
  Visa:           { accent: '#4d8fff', accentRgb: '77,143,255' },
  Permis:         { accent: '#7C3AED', accentRgb: '124,58,237' },
  Emploi:         { accent: '#F59E0B', accentRgb: '245,158,11' },
  'Vie étudiante':{ accent: '#06B6D4', accentRgb: '6,182,212' },
  Finances:       { accent: '#10B981', accentRgb: '16,185,129' },
  Démarches:      { accent: '#A855F7', accentRgb: '168,85,247' },
  Santé:          { accent: '#F43F5E', accentRgb: '244,63,94' },
  CAF:            { accent: '#E879F9', accentRgb: '232,121,249' },
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

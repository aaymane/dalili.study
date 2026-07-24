import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export type { PostMeta } from './blog-client';
export { CLUSTER_DEFINITIONS, CATEGORY_COLORS, formatDate } from './blog-client';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

import type { PostMeta } from './blog-client';

export const CLUSTER_MAP: Record<string, string> = {
  'delai-visa-etudiant-france-tout-savoir':             'visa',
  'visa-etudiant-france-tout-savoir-avant-partir':      'visa',
  'garant-logement-etudiant-etranger-france':           'logement',
  'logement-crous-etudiant-etranger-demande':           'logement',
  'residence-universitaire-vs-appart-prive-etudiant':   'logement',
  'trouver-logement-france-depuis-etranger':            'logement',
  'budget-mensuel-etudiant-etranger-france-2026':       'banque',
  'comment-ouvrir-compte-bancaire-france-sans-adresse-fixe': 'banque',
  'ouvrir-compte-bancaire-etudiant-etranger-2026':      'banque',
  'caf-etudiant-etranger-delais-documents-erreurs':     'aides',
  'reforme-apl-etudiant-etranger-2026':                 'aides',
  'bourses-etudes-etudiants-etrangers-france-2026':     'aides',
  'alternance-etudiant-etranger-france':                'emploi',
  'stage-france-etudiant-etranger-convention':          'emploi',
  'travailler-en-france-etudiant-etranger':             'emploi',
  'etudier-paris-etudiant-etranger-guide':              'vie-etudiante',
  'systeme-universitaire-francais-guide-etranger':      'vie-etudiante',
  'transport-etudiant-france-abonnements-reductions':   'vie-etudiante',
  'medecin-traitant-france-etudiant-etranger':                                  'sante',
  'securite-sociale-etudiante-france-inscription':                              'sante',
  'securite-sociale-complementaire-sante-solidaire-etudiant-etranger':         'sante',
  'carte-vitale-etudiant-etranger-guide':                                       'sante',
  'titre-sejour-etudiant-france-renouvellement':        'demarches',
  'visale-refuse-proprietaire-que-faire':               'logement',
  'contester-refus-visa-campus-france':                 'visa',
  'droits-etudiant-etranger-france-guide-complet':      'vie-etudiante',
  'litige-universite-etudiant-etranger':                'vie-etudiante',
  // Maroc cluster
  'campusfrance-maroc-guide-complet':                   'maroc',
  'visa-etudiant-france-maroc-2026':                    'maroc',
  'tcf-maroc-2026-guide-complet':                       'maroc',
  'comment-preparer-tcf-30-jours-etudiant-maroc':       'maroc',
  'calendrier-tcf-maroc-2026-dates-sessions':           'maroc',
  // Algérie cluster
  'visa-etudiant-france-algerie-2026':                  'algerie',
  'campusfrance-algerie-guide-entretien-2026':          'algerie',
  'etudier-france-algerien-temoignage-conseils':        'algerie',
  // Sénégal cluster
  'visa-etudiant-france-senegal-2026':                  'senegal',
  'campusfrance-senegal-guide-inscription-dakar':       'senegal',
  'budget-etudiant-senegalais-france-2026':             'senegal',
  'tcf-senegal-dakar-guide-2026':                       'senegal',
  'bourses-etudiants-senegalais-france-2026':           'senegal',
  'communaute-senegalaise-france-villes':               'senegal',
  'medecine-pharmacie-france-etudiant-senegalais':      'senegal',
  // Tunisie cluster
  'etudier-en-france-depuis-tunisie':                   'tunisie',
  'campusfrance-tunisie-guide-complet-2026':            'tunisie',
  'tcf-tunisie-centres-dates-2026':                     'tunisie',
  'bourses-etudes-france-etudiants-tunisiens':          'tunisie',
  'visa-etudiant-france-tunisie-2026':                  'tunisie',
  'logement-etudiant-france-tunisien-guide':            'tunisie',
  'compte-bloque-visa-etudiant-france-guide':           'tunisie',
  // Liban cluster
  'etudier-en-france-depuis-liban-guide-2026':          'liban',
  'campus-france-liban-procedure-2026':                 'liban',
  'bourses-etudiants-libanais-france-2026':             'liban',
  'visa-etudiant-france-liban-2026':                    'liban',
  'reconnaitre-diplome-libanais-france':                'liban',
  // Côte d'Ivoire cluster
  'etudier-en-france-depuis-cote-ivoire':               'cote-ivoire',
  // Cameroun cluster
  'etudier-en-france-depuis-cameroun':                  'cameroun',
  // Articles généraux visa-campus-france
  'lettre-motivation-campus-france-exemple-2026':       'visa-campus-france',
  'delf-dalf-vs-tcf-etudiant-etranger-france':          'visa-campus-france',
  'parcoursup-etudiant-etranger-guide-2026':            'visa-campus-france',
  'ofii-validation-visa-etudiant-france-guide':         'visa-campus-france',
  'ecole-privee-france-reconnue-etat-comment-verifier': 'visa-campus-france',
  'arnaques-etudes-france-etudiant-etranger-eviter':    'visa-campus-france',
  'ecole-privee-vs-universite-publique-etudiant-etranger': 'visa-campus-france',
  // Articles études
  'frais-scolarite-universite-france-etudiant-etranger-2026': 'banque',
  'informatique-france-etudiant-etranger':              'vie-etudiante',
  // Médecine cluster
  'medecine-france-etudiant-etranger-guide-complet':    'medecine',
  'cout-etudes-medecine-france-etudiant-etranger':      'medecine',
  'faculte-medecine-france-etudiant-etranger-admission':'medecine',
  'pass-las-etudiant-etranger-medecine-france':         'medecine',
  'equivalence-diplome-medecine-etranger-france':       'medecine',
  'etudier-medecine-france-depuis-maroc':               'medecine',
  'faculte-medecine-privee-france-prix':                'medecine',
};

export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx$/, '');
      const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8'));
      return { slug, ...(data as Omit<PostMeta, 'slug'>) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRawPost(slug: string): { content: string; frontmatter: Omit<PostMeta, 'slug'> } {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  return { content, frontmatter: data as Omit<PostMeta, 'slug'> };
}

// Match rehype-slug v6 behavior (GitHub Slugger, no hyphen collapse):
//   1. spaces  ->  hyphens  FIRST
//      " : "  ->  "-:-"  ->  remove ":"  ->  "--"  (double hyphen preserved, NOT collapsed)
//   2. strip everything except \w, Latin-Ext-A (U+00C0-U+024F), and hyphens
// Do NOT collapse consecutive hyphens — rehype-slug v6 does not.
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\wÀ-ɏ-]/g, '');
}

export function extractHeadings(mdxContent: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /^(#{2,3}) (.+)$/gm;
  let match;
  while ((match = regex.exec(mdxContent)) !== null) {
    headings.push({
      level: match[1].length as 2 | 3,
      text: match[2].trim(),
      id: slugifyHeading(match[2].trim()),
    });
  }
  return headings;
}

// ── Cluster-aware related posts ───────────────────────────────────

export function getClusterArticles(cluster: string, excludeSlug: string): PostMeta[] {
  return getAllPosts().filter(
    p => p.slug !== excludeSlug && (CLUSTER_MAP[p.slug] === cluster),
  );
}

export function getRelatedPosts(slug: string, count = 5): PostMeta[] {
  const all = getAllPosts();
  const cluster = CLUSTER_MAP[slug];
  const current = all.find(p => p.slug === slug);
  const sameCluster = all.filter(p => p.slug !== slug && CLUSTER_MAP[p.slug] === cluster);
  const sameCategory = all.filter(p => p.slug !== slug && p.category === current?.category && !sameCluster.find(s => s.slug === p.slug));
  const others = all.filter(p => p.slug !== slug && !sameCluster.find(s => s.slug === p.slug) && !sameCategory.find(s => s.slug === p.slug));
  return [...sameCluster, ...sameCategory, ...others].slice(0, count);
}

// ── FAQ extraction for JSON-LD ────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

// Strip common markdown syntax to produce plain text suitable for schema.org
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')            // *italic* → italic
    .replace(/`([^`]+)`/g, '$1')              // `code` → code
    .trim();
}

/**
 * Extracts FAQ question/answer pairs from raw MDX content.
 *
 * Looks for a heading matching /FAQ/i (## or ###), then within that section
 * recognises questions in two formats:
 *   1. Bold line:   **Question ?**
 *   2. Sub-heading: ### Question ?
 *
 * The answer is the first non-empty paragraph that follows each question.
 * Returns an empty array when no FAQ section exists (schema is omitted).
 */
export function extractFaqItems(mdxContent: string): FaqItem[] {
  const lines = mdxContent.split('\n');

  // Find the FAQ section boundaries
  let faqStart = -1;
  let faqEnd = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (faqStart === -1 && /^#{2,3}\s+.*faq/i.test(line)) {
      faqStart = i + 1;
    } else if (faqStart !== -1 && /^## [^#]/.test(line)) {
      faqEnd = i;
      break;
    }
  }

  if (faqStart === -1) return [];

  const faqLines = lines.slice(faqStart, faqEnd);
  const items: FaqItem[] = [];
  let i = 0;

  const isBoldQ   = (l: string) => /^\*\*(.+[?？])\s*\*\*\s*$/.test(l);
  const isHeadQ   = (l: string) => /^#{2,3}\s+(.+[?？])\s*$/.test(l);
  const isQuestion = (l: string) => isBoldQ(l) || isHeadQ(l);

  const extractQ  = (l: string): string => {
    const bm = l.match(/^\*\*(.+[?？])\s*\*\*\s*$/);
    const hm = l.match(/^#{2,3}\s+(.+[?？])\s*$/);
    return (bm?.[1] ?? hm?.[1] ?? '').trim();
  };

  while (i < faqLines.length) {
    const line = faqLines[i];
    if (!isQuestion(line)) { i++; continue; }

    const questionText = extractQ(line);
    i++;

    // Collect the first paragraph after the question
    const parts: string[] = [];
    while (i < faqLines.length) {
      if (isQuestion(faqLines[i])) break;
      const t = faqLines[i].trim();
      if (t) {
        parts.push(t);
      } else if (parts.length > 0) {
        break; // blank line after content = end of paragraph
      }
      i++;
    }

    if (parts.length > 0) {
      items.push({ question: questionText, answer: stripMarkdown(parts.join(' ')) });
    }
  }

  return items;
}

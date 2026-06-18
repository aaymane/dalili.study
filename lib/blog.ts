import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

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
};

export const CLUSTER_MAP: Record<string, string> = {
  'campusfrance-maroc-guide-complet':                   'visa',
  'delai-visa-etudiant-france-tout-savoir':             'visa',
  'visa-etudiant-france-algerie-2026':                  'visa',
  'visa-etudiant-france-maroc-2026':                    'visa',
  'visa-etudiant-france-tout-savoir-avant-partir':      'visa',
  'garant-logement-etudiant-etranger-france':           'logement',
  'logement-crous-etudiant-etranger-demande':           'logement',
  'residence-universitaire-vs-appart-prive-etudiant':   'logement',
  'trouver-logement-france-depuis-etranger':            'logement',
  'budget-mensuel-etudiant-etranger-france-2026':       'banque',
  'comment-ouvrir-compte-bancaire-france-sans-adresse-fixe': 'banque',
  'ouvrir-compte-bancaire-etudiant-etranger-2026':      'banque',
  'caf-etudiant-etranger-delais-documents-erreurs':     'aides',
  'bourses-etudes-etudiants-etrangers-france-2026':     'aides',
  'alternance-etudiant-etranger-france':                'emploi',
  'stage-france-etudiant-etranger-convention':          'emploi',
  'travailler-en-france-etudiant-etranger':             'emploi',
  'etudier-paris-etudiant-etranger-guide':              'vie-etudiante',
  'systeme-universitaire-francais-guide-etranger':      'vie-etudiante',
  'transport-etudiant-france-abonnements-reductions':   'vie-etudiante',
  'medecin-traitant-france-etudiant-etranger':          'sante',
  'securite-sociale-etudiante-france-inscription':      'sante',
  'titre-sejour-etudiant-france-renouvellement':        'demarches',
  'visale-refuse-proprietaire-que-faire':               'logement',
  'contester-refus-visa-campus-france':                 'visa',
  'droits-etudiant-etranger-france-guide-complet':      'vie-etudiante',
  'litige-universite-etudiant-etranger':                'vie-etudiante',
};

export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

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

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
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

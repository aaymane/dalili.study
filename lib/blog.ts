import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  author: string;
  ogImage?: string;
}

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

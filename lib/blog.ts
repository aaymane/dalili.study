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
  Banque:   { accent: '#22C55E', accentRgb: '34,197,94' },
  Logement: { accent: '#EFB370', accentRgb: '239,179,112' },
  Visa:     { accent: '#4d8fff', accentRgb: '77,143,255' },
  Permis:   { accent: '#7C3AED', accentRgb: '124,58,237' },
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

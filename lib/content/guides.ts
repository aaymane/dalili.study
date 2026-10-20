// Turns a guide's MDX into the JSON the mobile app renders natively.
// Same files as the pages (content/blog/*.mdx), same FAQ rules as the
// JSON-LD (extractFaqItems), so the app can never drift from the site.
//
// Server-only (reads the filesystem). Used by /api/content/v1/*.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, RootContent, PhrasingContent, ListItem, TableRow } from 'mdast';

import { CLUSTER_MAP, extractFaqItems, getAllPosts } from '@/lib/blog';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');
const SITE = 'https://dalili.study';

export type CountryCode = 'MA' | 'DZ' | 'TN' | 'SN' | 'LB' | 'CI' | 'CM';
export const ALL_COUNTRIES: CountryCode[] = ['MA', 'DZ', 'TN', 'SN', 'LB', 'CI', 'CM'];

const CLUSTER_COUNTRY: Record<string, CountryCode> = {
  maroc: 'MA',
  algerie: 'DZ',
  tunisie: 'TN',
  senegal: 'SN',
  liban: 'LB',
  'cote-ivoire': 'CI',
  cameroun: 'CM',
};

// Guides filed under a country cluster but useful to everyone (the compte
// bloqué guide sits in « tunisie » for SEO reasons).
const GENERAL_DESPITE_CLUSTER = new Set(['compte-bloque-visa-etudiant-france-guide']);

/**
 * Inline text keeps a tiny markdown subset the app knows how to render:
 * **bold** and [label](url). Internal links stay relative (/blog/slug) so the
 * app can open them as in-app guides.
 */
export type Block =
  | { type: 'h2' | 'h3'; text: string; id: string }
  | { type: 'p'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'callout'; tone: 'info' | 'warning'; text: string };

export interface KeyFacts {
  facts: string[];
  source: string | null;
}

export interface GuideSummary {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  cluster: string | null;
  countries: CountryCode[];
  date: string;
  updatedDate: string;
  readTime: string;
  url: string;
}

export interface Guide extends GuideSummary {
  summary: string;
  keyFacts: KeyFacts | null;
  documents: string[];
  faq: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  blocks: Block[];
}

interface AppFrontmatter {
  appSummary?: string;
  countries?: CountryCode[];
  documents?: string[];
  sources?: { label: string; url: string }[];
}

function countriesFor(slug: string, cluster: string | null, fm: AppFrontmatter): CountryCode[] {
  if (fm.countries?.length) return fm.countries;
  if (GENERAL_DESPITE_CLUSTER.has(slug)) return ALL_COUNTRIES;
  const country = cluster ? CLUSTER_COUNTRY[cluster] : undefined;
  return country ? [country] : ALL_COUNTRIES;
}

/** Same rule as lib/blog.ts headings, so anchors match the rendered page. */
function headingId(text: string): string {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\wÀ-ɏ-]/g, '');
}

function extractKeyFacts(body: string): { body: string; keyFacts: KeyFacts | null } {
  const match = body.match(/<KeyFacts([\s\S]*?)\/>/);
  if (!match) return { body, keyFacts: null };
  const attrs: Record<string, string> = {};
  for (const m of Array.from(match[1].matchAll(/(\w+)="([^"]*)"/g))) attrs[m[1]] = m[2];
  const facts = Object.keys(attrs)
    .filter(k => k !== 'source')
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    .map(k => attrs[k]);
  return { body: body.replace(match[0], ''), keyFacts: { facts, source: attrs.source ?? null } };
}

/** Callouts become a marker paragraph; other JSX (CTA, related articles) is page chrome. */
function stripJsx(body: string): string {
  return body
    .replace(/<Callout(?:\s+type="(\w+)")?[^>]*>([\s\S]*?)<\/Callout>/g, (_, tone, inner) => `\n\n:::callout-${tone === 'warning' ? 'warning' : 'info'}\n${inner.trim()}\n\n`)
    .replace(/<[A-Z][A-Za-z]*(?:\s[\s\S]*?)?\/>/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

function absolute(url: string): string {
  if (url.startsWith('/blog/')) return url;
  if (url.startsWith('/')) return `${SITE}${url}`;
  return url;
}

function inline(nodes: PhrasingContent[]): string {
  return nodes
    .map(n => {
      switch (n.type) {
        case 'text':
          return n.value;
        case 'inlineCode':
          return n.value;
        case 'strong':
          return `**${inline(n.children)}**`;
        case 'emphasis':
        case 'delete':
          return inline(n.children);
        case 'link':
          return `[${inline(n.children)}](${absolute(n.url)})`;
        case 'break':
          return '\n';
        default:
          return 'children' in n ? inline(n.children as PhrasingContent[]) : '';
      }
    })
    .join('');
}

function itemText(item: ListItem): string {
  return item.children
    .map(c => (c.type === 'paragraph' ? inline(c.children) : ''))
    .filter(Boolean)
    .join(' ');
}

function rowCells(row: TableRow): string[] {
  return row.children.map(cell => inline(cell.children));
}

const plain = (s: string) => s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();

function toBlocks(tree: Root): Block[] {
  const blocks: Block[] = [];
  let inFaq = false;
  for (const node of tree.children as RootContent[]) {
    if (node.type === 'heading') {
      const text = plain(inline(node.children));
      if (node.depth <= 2) inFaq = /faq|questions fréquentes/i.test(text);
      if (inFaq || node.depth > 3) continue;
      blocks.push({ type: node.depth <= 2 ? 'h2' : 'h3', text, id: headingId(text) });
      continue;
    }
    if (inFaq) continue;
    if (node.type === 'paragraph') {
      const text = inline(node.children).trim();
      const callout = text.match(/^:::callout-(info|warning)\n?([\s\S]*)$/);
      if (callout) blocks.push({ type: 'callout', tone: callout[1] as 'info' | 'warning', text: callout[2].trim() });
      else if (text) blocks.push({ type: 'p', text });
    } else if (node.type === 'list') {
      blocks.push({ type: 'list', ordered: !!node.ordered, items: node.children.map(itemText) });
    } else if (node.type === 'table') {
      const [head, ...rows] = node.children;
      blocks.push({ type: 'table', header: rowCells(head), rows: rows.map(rowCells) });
    } else if (node.type === 'blockquote') {
      const text = node.children.map(c => (c.type === 'paragraph' ? inline(c.children) : '')).join('\n').trim();
      if (text) blocks.push({ type: 'callout', tone: 'info', text });
    }
  }
  // A callout marker can land in its own paragraph followed by the content paragraph.
  return blocks.flatMap((b, i, all) => {
    if (b.type === 'callout' && !b.text && all[i + 1]?.type === 'p') return [];
    if (b.type === 'p' && all[i - 1]?.type === 'callout' && !(all[i - 1] as { text: string }).text) {
      return [{ type: 'callout', tone: (all[i - 1] as { tone: 'info' | 'warning' }).tone, text: b.text } as Block];
    }
    return [b];
  });
}

/** First list under a heading about documents to bring — deterministic, read from the guide itself. */
function findDocuments(blocks: Block[]): string[] {
  const i = blocks.findIndex(b => (b.type === 'h2' || b.type === 'h3') && /^(liste complète des )?documents (à|requis|à préparer|à uploader|à scanner)|^les documents (à|requis)|^pièces (à fournir|justificatives)/i.test(b.text));
  if (i === -1) return [];
  for (let j = i + 1; j < blocks.length; j++) {
    const b = blocks[j];
    if (b.type === 'h2') break;
    if (b.type === 'list') return b.items.map(plain).slice(0, 12);
  }
  return [];
}

function findSources(blocks: Block[], keyFacts: KeyFacts | null): { label: string; url: string }[] {
  const out = new Map<string, string>();
  const scan = (t: string) => {
    for (const m of Array.from(t.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g))) {
      if (!m[2].includes('dalili.study') && !out.has(m[2])) out.set(m[2], plain(m[1]));
    }
  };
  for (const b of blocks) {
    if (b.type === 'p' || b.type === 'callout') scan(b.text);
    else if (b.type === 'list') b.items.forEach(scan);
    else if (b.type === 'table') b.rows.flat().forEach(scan);
  }
  const list = Array.from(out, ([url, label]) => ({ label, url })).slice(0, 8);
  return keyFacts?.source ? [{ label: keyFacts.source, url: '' }, ...list] : list;
}

function summaryOf(slug: string, data: Record<string, unknown>): GuideSummary {
  const cluster = (data.cluster as string | undefined) ?? CLUSTER_MAP[slug] ?? null;
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    excerpt: String(data.excerpt ?? data.description ?? ''),
    category: String(data.category ?? ''),
    cluster,
    countries: countriesFor(slug, cluster, data as AppFrontmatter),
    date: String(data.date ?? ''),
    updatedDate: String(data.updatedDate ?? data.date ?? ''),
    readTime: String(data.readTime ?? ''),
    url: `${SITE}/blog/${slug}`,
  };
}

export function listGuides(): GuideSummary[] {
  return getAllPosts().map(p => summaryOf(p.slug, p as unknown as Record<string, unknown>));
}

export function getGuide(slug: string): Guide | null {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const fm = data as AppFrontmatter;
  const { body, keyFacts } = extractKeyFacts(content);
  const tree = unified().use(remarkParse).use(remarkGfm).parse(stripJsx(body)) as Root;
  const blocks = toBlocks(tree);
  const meta = summaryOf(slug, data);
  return {
    ...meta,
    summary: fm.appSummary ?? meta.excerpt,
    keyFacts,
    documents: fm.documents ?? findDocuments(blocks),
    faq: extractFaqItems(content).map(f => ({ question: f.question, answer: f.answer })),
    sources: fm.sources ?? findSources(blocks, keyFacts),
    blocks,
  };
}

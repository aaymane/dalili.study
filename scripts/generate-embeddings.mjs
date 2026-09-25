#!/usr/bin/env node
// Populates Supabase `content_chunks` for the RAG assistant: chunks every
// content/blog/*.mdx, content/villes/*.mdx and content/universites/*.mdx
// into H2 sections + FAQ pairs, embeds each chunk with Voyage AI, and
// upserts. Safe to re-run — unchanged chunks are skipped via content_hash,
// and chunks removed from a page are deleted.
//
// Self-contained on purpose, not importing from lib/: lib/blog.ts re-exports
// from './blog-client' without a file extension, which is valid under
// TypeScript's bundler resolution (what Next.js uses) but fails under
// Node's native ESM/TS resolution. Duplicating the small amount of parsing
// logic here avoids that mismatch entirely.
//
// Usage: node --env-file=.env.local scripts/generate-embeddings.mjs [--dry-run]
//   --dry-run  parse and diff against the table, print what would change, write nothing.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const VOYAGE_EMBED_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-4-lite';
const EMBED_BATCH_SIZE = 16;
const DRY_RUN = process.argv.includes('--dry-run');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const voyageKey = process.env.VOYAGE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY.');
  console.error('Run with: node --env-file=.env.local scripts/generate-embeddings.mjs');
  process.exit(1);
}
if (!voyageKey) {
  console.error('Missing VOYAGE_API_KEY. Run with: node --env-file=.env.local scripts/generate-embeddings.mjs');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

// ── Voyage embeddings (duplicated from lib/assistant/voyage.ts — see header note) ──

async function embedDocuments(texts) {
  const res = await fetch(VOYAGE_EMBED_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${voyageKey}` },
    body: JSON.stringify({ input: texts, model: VOYAGE_MODEL, input_type: 'document' }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Voyage embeddings request failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  return json.data.sort((a, b) => a.index - b.index).map(d => d.embedding);
}

// ── MDX parsing (mirrors lib/blog.ts's slug/FAQ rules so anchors match the rendered site) ──

function slugifyHeading(text) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\wÀ-ɏ-]/g, '');
}

// Villes/universités pages render MDX through rehype-slug, which uses
// github-slugger: lowercase, drop punctuation/symbols (keeping letters incl.
// accents, digits, "-" and "_"), then each space → "-". github-slugger itself
// isn't imported, for the same self-containment reason as above.
function githubSlug(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '').replace(/ /g, '-');
}

// Villes/universités MDX files have no frontmatter — their display names live
// in lib/cities.ts / lib/universities.ts. Read the `'slug': { … name: '…' }`
// pairs textually rather than importing TypeScript (see header note).
function readNames(libFile) {
  const src = fs.readFileSync(path.join(process.cwd(), 'lib', libFile), 'utf8');
  const names = new Map();
  const re = /^  '([a-z0-9-]+)': \{\s*\n\s*slug: '[^']*',\s*\n\s*name: '((?:[^'\\]|\\.)*)'/gm;
  let m;
  while ((m = re.exec(src)) !== null) names.set(m[1], m[2].replace(/\\'/g, "'"));
  return names;
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function extractFaqItems(mdxContent) {
  const lines = mdxContent.split('\n');
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
  const items = [];
  let i = 0;

  const isBoldQ = l => /^\*\*(.+[?？])\s*\*\*\s*$/.test(l);
  const isHeadQ = l => /^#{2,3}\s+(.+[?？])\s*$/.test(l);
  const isQuestion = l => isBoldQ(l) || isHeadQ(l);
  const extractQ = l => {
    const bm = l.match(/^\*\*(.+[?？])\s*\*\*\s*$/);
    const hm = l.match(/^#{2,3}\s+(.+[?？])\s*$/);
    return (bm?.[1] ?? hm?.[1] ?? '').trim();
  };

  while (i < faqLines.length) {
    const line = faqLines[i];
    if (!isQuestion(line)) { i++; continue; }
    const questionText = extractQ(line);
    i++;
    const parts = [];
    while (i < faqLines.length) {
      if (isQuestion(faqLines[i])) break;
      const t = faqLines[i].trim();
      if (t) parts.push(t);
      else if (parts.length > 0) break;
      i++;
    }
    if (parts.length > 0) items.push({ question: questionText, answer: stripMarkdown(parts.join(' ')) });
  }
  return items;
}

// Curated fact blocks are the highest-value content for grounding — pull
// them out as their own chunk instead of losing them to JSX stripping.
function extractKeyFacts(body) {
  const match = body.match(/<KeyFacts([\s\S]*?)\/>/);
  if (!match) return { withoutBlock: body, chunk: null };

  const attrs = {};
  const attrRegex = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = attrRegex.exec(match[1])) !== null) attrs[m[1]] = m[2];

  const bullets = Object.keys(attrs)
    .filter(k => k !== 'source')
    .sort()
    .map(k => `- ${attrs[k]}`);

  const withoutBlock = body.replace(match[0], '');
  if (bullets.length === 0) return { withoutBlock, chunk: null };

  const content = bullets.join('\n') + (attrs.source ? `\nSource : ${attrs.source}` : '');
  return { withoutBlock, chunk: { heading: 'Points clés vérifiés', content } };
}

function stripJsx(text) {
  return text
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, '$1')
    .replace(/<[A-Z][A-Za-z]*(?:\s[\s\S]*?)?\/>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitH2Sections(body) {
  const lines = body.split('\n');
  const sections = [{ heading: null, lines: [] }];
  for (const line of lines) {
    const m = line.match(/^## (.+)$/);
    if (m) sections.push({ heading: m[1].trim(), lines: [] });
    else sections[sections.length - 1].lines.push(line);
  }
  return sections;
}

function chunkPost(source, slug, frontmatter, rawBody) {
  const { withoutBlock, chunk: keyFactsChunk } = extractKeyFacts(rawBody);
  const cleaned = stripJsx(withoutBlock);
  const faqItems = extractFaqItems(rawBody);
  const sections = splitH2Sections(cleaned);

  const raw = [];
  if (keyFactsChunk) raw.push({ heading: keyFactsChunk.heading, content: keyFactsChunk.content, isFaq: false });

  for (const s of sections) {
    const heading = s.heading ?? frontmatter.title;
    if (s.heading && /faq/i.test(s.heading)) continue; // handled via extractFaqItems below
    const content = s.lines.join('\n').trim().replace(/\n{3,}/g, '\n\n');
    if (content.length < 40) continue;
    raw.push({ heading, content, isFaq: false });
  }

  for (const item of faqItems) {
    raw.push({ heading: item.question, content: `${item.question}\n${item.answer}`, isFaq: true });
  }

  return raw.map(c => ({
    source_type: `${source.type}_${c.isFaq ? 'faq' : 'section'}`,
    slug,
    title: frontmatter.title,
    url: c.isFaq ? `/${source.dir}/${slug}` : `/${source.dir}/${slug}#${source.anchor(c.heading)}`,
    category: frontmatter.category ?? source.category ?? null,
    cluster: frontmatter.cluster ?? null,
    heading: c.heading,
    content: c.content,
    updated_date: frontmatter.updatedDate ?? frontmatter.date ?? null,
    content_hash: crypto.createHash('sha256').update(`${c.heading}\n${c.content}`).digest('hex'),
  }));
}

// ── Main ─────────────────────────────────────────────────────────────────

const cityNames = readNames('cities.ts');
const universityNames = readNames('universities.ts');

// dir = folder under content/ AND the site's URL prefix for that content type.
const SOURCES = [
  { dir: 'blog', type: 'blog', anchor: slugifyHeading, frontmatterFor: fm => fm },
  {
    dir: 'villes',
    type: 'ville',
    category: 'Villes',
    anchor: githubSlug,
    frontmatterFor: (fm, slug) => ({ ...fm, title: cityNames.has(slug) ? `Étudier à ${cityNames.get(slug)}` : null }),
  },
  {
    dir: 'universites',
    type: 'universite',
    category: 'Universités',
    anchor: githubSlug,
    frontmatterFor: (fm, slug) => ({ ...fm, title: universityNames.get(slug) ?? null }),
  },
];

async function main() {
  const pages = [];
  for (const source of SOURCES) {
    const files = fs.readdirSync(path.join(CONTENT_DIR, source.dir)).filter(f => f.endsWith('.mdx'));
    console.log(`Found ${files.length} pages in content/${source.dir}.`);
    for (const filename of files) pages.push({ source, filename });
  }

  let toEmbed = [];
  let toDeleteIds = [];
  let unchanged = 0;

  for (const { source, filename } of pages) {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(CONTENT_DIR, source.dir, filename), 'utf8');
    const parsed = matter(raw);
    const frontmatter = source.frontmatterFor(parsed.data, slug);
    const body = parsed.content;

    // An MDX file with no matching entry in lib/ has no page on the site
    // (generateStaticParams comes from lib/) — indexing it would cite a 404.
    if (!frontmatter.title) {
      console.warn(`Skipping content/${source.dir}/${filename}: no entry in lib/ → no rendered page.`);
      continue;
    }

    const chunks = chunkPost(source, slug, frontmatter, body);

    const { data: existing, error } = await supabase
      .from('content_chunks')
      .select('id, heading, content_hash')
      .eq('slug', slug);
    if (error) throw error;

    const existingByHeading = new Map(existing.map(e => [e.heading, e]));
    const newHeadings = new Set(chunks.map(c => c.heading));

    for (const chunk of chunks) {
      const prior = existingByHeading.get(chunk.heading);
      if (prior && prior.content_hash === chunk.content_hash) {
        unchanged++;
        continue;
      }
      toEmbed.push({ ...chunk, _existingId: prior?.id ?? null });
    }

    for (const e of existing) {
      if (!newHeadings.has(e.heading)) toDeleteIds.push(e.id);
    }
  }

  console.log(`${unchanged} chunks unchanged, ${toEmbed.length} to (re)embed, ${toDeleteIds.length} stale chunks to delete.`);

  if (DRY_RUN) {
    const bySlug = new Map();
    for (const c of toEmbed) bySlug.set(c.slug, (bySlug.get(c.slug) ?? 0) + 1);
    for (const [slug, n] of bySlug) console.log(`  ${String(n).padStart(3)}  ${slug}`);
    for (const c of toEmbed.filter(c => c.source_type !== 'blog_section' && c.source_type !== 'blog_faq').slice(0, 6)) {
      console.log(`  e.g. [${c.source_type}] ${c.title} → ${c.url}`);
    }
    console.log('Dry run — nothing written.');
    return;
  }

  for (let i = 0; i < toEmbed.length; i += EMBED_BATCH_SIZE) {
    const batch = toEmbed.slice(i, i + EMBED_BATCH_SIZE);
    console.log(`Embedding batch ${i / EMBED_BATCH_SIZE + 1}/${Math.ceil(toEmbed.length / EMBED_BATCH_SIZE)}...`);
    const embeddings = await embedDocuments(batch.map(c => `${c.heading}\n${c.content}`));

    const rows = batch.map((c, j) => ({
      ...(c._existingId ? { id: c._existingId } : {}),
      source_type: c.source_type,
      slug: c.slug,
      title: c.title,
      url: c.url,
      category: c.category,
      cluster: c.cluster,
      heading: c.heading,
      content: c.content,
      updated_date: c.updated_date,
      content_hash: c.content_hash,
      embedding: embeddings[j],
    }));

    // A batch can mix updates (id set) and inserts (no id). Without
    // defaultToNull: false, PostgREST sends id = null for the inserts
    // instead of letting the column default generate one.
    const { error } = await supabase.from('content_chunks').upsert(rows, { defaultToNull: false });
    if (error) throw error;
  }

  // Delete only after the replacements are in, so a failed run never leaves
  // a page with missing sections.
  if (toDeleteIds.length > 0) {
    const { error } = await supabase.from('content_chunks').delete().in('id', toDeleteIds);
    if (error) throw error;
  }

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

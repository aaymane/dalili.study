#!/usr/bin/env node
// Populates Supabase `content_chunks` for the RAG assistant: chunks every
// content/blog/*.mdx into H2 sections + FAQ pairs, embeds each chunk with
// Voyage AI, and upserts. Safe to re-run — unchanged chunks are skipped via
// content_hash, and chunks removed from an article are deleted.
//
// Self-contained on purpose, not importing from lib/: lib/blog.ts re-exports
// from './blog-client' without a file extension, which is valid under
// TypeScript's bundler resolution (what Next.js uses) but fails under
// Node's native ESM/TS resolution. Duplicating the small amount of parsing
// logic here avoids that mismatch entirely.
//
// Usage: node --env-file=.env.local scripts/generate-embeddings.mjs

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');
const VOYAGE_EMBED_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-4-lite';
const EMBED_BATCH_SIZE = 16;

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

function chunkPost(slug, frontmatter, rawBody) {
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
    source_type: c.isFaq ? 'blog_faq' : 'blog_section',
    slug,
    title: frontmatter.title,
    url: c.isFaq ? `/blog/${slug}` : `/blog/${slug}#${slugifyHeading(c.heading)}`,
    category: frontmatter.category ?? null,
    cluster: frontmatter.cluster ?? null,
    heading: c.heading,
    content: c.content,
    updated_date: frontmatter.updatedDate ?? frontmatter.date ?? null,
    content_hash: crypto.createHash('sha256').update(`${c.heading}\n${c.content}`).digest('hex'),
  }));
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`Found ${files.length} articles.`);

  let toEmbed = [];
  let toDeleteIds = [];
  let unchanged = 0;

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data: frontmatter, content: body } = matter(raw);

    const chunks = chunkPost(slug, frontmatter, body);

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

  if (toDeleteIds.length > 0) {
    const { error } = await supabase.from('content_chunks').delete().in('id', toDeleteIds);
    if (error) throw error;
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

    const { error } = await supabase.from('content_chunks').upsert(rows);
    if (error) throw error;
  }

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

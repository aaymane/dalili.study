import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dalili.study';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  // ── Blog articles (priority 0.7, use updatedDate when available) ──
  const articles: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedDate ? new Date(post.updatedDate) : new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    // ── Homepage ──────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── Blog index ───────────────────────────────────────────────
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0]?.updatedDate
        ? new Date(posts[0].updatedDate)
        : posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ── Pays pages (priority 0.9) ────────────────────────────────
    {
      url: `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pays/etudier-en-france-depuis-algerie`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pays/etudier-en-france-depuis-senegal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Universités pages (priority 0.9) ─────────────────────────
    {
      url: `${SITE_URL}/universites/universite-de-bordeaux`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/universites/universite-de-nantes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/universites/universite-de-lille`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/universites/sorbonne-universite`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Section indexes (priority 0.8) ───────────────────────────
    {
      url: `${SITE_URL}/universites`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/villes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Villes pages (priority 0.8) ──────────────────────────────
    {
      url: `${SITE_URL}/villes/etudier-a-bordeaux`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/villes/etudier-a-paris`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/villes/etudier-a-nantes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/villes/etudier-a-lyon`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Checklist PDF page (priority 0.8) ───────────────────────
    {
      url: `${SITE_URL}/checklist`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Static pages (priority 0.7) ──────────────────────────────
    {
      url: `${SITE_URL}/a-propos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },

    // ── Blog articles ─────────────────────────────────────────────
    ...articles,
  ];
}

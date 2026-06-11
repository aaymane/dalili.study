import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dalili-waitlist.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const articles: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles,
  ];
}

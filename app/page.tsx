import type { Metadata } from 'next';
import ClientHomePage from '@/components/ClientHomePage';
import { FAQ_ITEMS } from '@/lib/faq-data';
import { getAllPosts } from '@/lib/blog';
import { UNIVERSITIES } from '@/lib/universities';
import { CITIES } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

// Self-referencing canonical with trailing slash — GSC was reporting
// "Duplicate, Google chose different canonical" partly because the root
// layout's canonical resolved to "https://dalili.study" (no trailing slash),
// which doesn't match the actual served root URL.
export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

// Rendered server-side → appears in initial HTML → Google indexes it immediately
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dalili',
  alternateName: 'Dalili Study',
  url: SITE_URL,
  description: 'Guide complet pour les étudiants internationaux en France — visa, logement, universités, villes.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dalili',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: 'Guide et plateforme pour les étudiants internationaux en France',
  sameAs: [],
};

export default function Home() {
  const guidesCount = getAllPosts().length;
  const universitesCount = Object.keys(UNIVERSITIES).length;
  const villesCount = Object.keys(CITIES).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ClientHomePage
        guidesCount={guidesCount}
        universitesCount={universitesCount}
        villesCount={villesCount}
      />
    </>
  );
}

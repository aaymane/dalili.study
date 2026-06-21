import ClientHomePage from '@/components/ClientHomePage';
import { FAQ_ITEMS } from '@/lib/faq-data';
import { getAllPosts } from '@/lib/blog';
import { UNIVERSITIES } from '@/lib/universities';
import { CITIES } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

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

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dalili',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <ClientHomePage
        guidesCount={guidesCount}
        universitesCount={universitesCount}
        villesCount={villesCount}
      />
    </>
  );
}

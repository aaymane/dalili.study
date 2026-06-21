import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getUniversity, getAllUniversitySlugs } from '@/lib/universities';
import { extractFaqItems } from '@/lib/blog';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { BLUR_DATA } from '@/lib/blur-data';
import mdxComponents from '@/components/blog/MdxComponents';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';
const ACCENT = '77,143,255';

const UNI_SEO: Record<string, { title: string; description: string; ogDescription: string }> = {
  'universite-de-bordeaux': {
    title: 'Université de Bordeaux : guide complet étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour intégrer l\'Université de Bordeaux : frais d\'inscription, bourses, logement CROUS, campus, débouchés professionnels. Conseils pour étudiants marocains, algériens et tunisiens.',
    ogDescription: 'Tout ce qu\'un étudiant marocain ou algérien doit savoir avant d\'intégrer l\'Université de Bordeaux — frais, bourses, logement, vie étudiante et carrière.',
  },
  'sorbonne-universite': {
    title: 'Sorbonne Université : guide complet étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à Sorbonne Université : admission, frais, logement à Paris, bourses, vie étudiante et débouchés. Le guide le plus complet pour étudiants maghrébins.',
    ogDescription: 'Sorbonne Université, top 100 mondial — guide pratique et honnête pour les étudiants marocains, algériens et tunisiens qui veulent intégrer la plus ancienne université de France.',
  },
  'universite-de-nantes': {
    title: 'Nantes Université : guide complet étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à Nantes Université : admission, frais, logement, CHU, Airbus, stages et vie étudiante nantaise. Guide dédié aux étudiants maghrébins.',
    ogDescription: 'Nantes Université, meilleure ville de France pour la qualité de vie — guide pratique complet pour intégrer l\'université et réussir à Nantes.',
  },
  'universite-de-lille': {
    title: 'Université de Lille : guide complet étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à l\'Université de Lille : budget le plus bas de France, logement, médecine, position européenne, communauté maghrébine et débouchés.',
    ogDescription: 'Université de Lille, 75 000 étudiants, 580€/mois de budget — le guide complet pour les étudiants marocains, algériens et tunisiens qui veulent étudier dans la ville la plus abordable de France.',
  },
  'universite-lyon-1': {
    title: 'Université Lyon 1 Claude Bernard : guide étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à l\'Université Lyon 1 : médecine, pharmacie, biotechnologies, campus La Doua, logement CROUS, stages Sanofi et bioMérieux. Guide pour étudiants marocains et africains.',
    ogDescription: 'Lyon 1, top université française en sciences de la santé — guide pratique complet : admission, frais, budget 700-1150€/mois, stages pharmaceutiques et vie étudiante à Lyon.',
  },
  'universite-toulouse-3': {
    title: 'Université Toulouse III Paul Sabatier : guide étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à l\'Université Toulouse 3 Paul Sabatier : ingénierie, aéronautique, Airbus, Thales, logement, budget 650-1050€/mois. Le guide dédié aux étudiants marocains et africains.',
    ogDescription: 'Paul Sabatier, l\'université à côté d\'Airbus — guide complet pour étudier à Toulouse : sciences, aéronautique, budget maîtrisé et opportunités industrielles uniques en France.',
  },
  'universite-de-montpellier': {
    title: 'Université de Montpellier : guide étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à l\'Université de Montpellier : faculté de médecine fondée en 1220, pharmacie, droit, logement, 300 jours de soleil. Guide pour étudiants marocains, africains et tunisiens.',
    ogDescription: 'Université de Montpellier, la plus ancienne faculté de médecine d\'Europe — guide pratique : admission, frais, budget méditerranéen, communauté africaine et vie étudiante.',
  },
  'universite-de-strasbourg': {
    title: 'Université de Strasbourg : guide étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à l\'Université de Strasbourg : droit européen, Sciences Po, Parlement Européen, stages institutions UE, logement. Le guide pour étudiants marocains et africains.',
    ogDescription: 'Université de Strasbourg, siège du Parlement Européen — guide pratique : droit international, stages EU, double culture franco-allemande et budget 650-1000€/mois.',
  },
  'aix-marseille-universite': {
    title: 'Aix-Marseille Université : guide étudiant étranger 2026 | Dalili',
    description: 'Guide complet pour étudier à Aix-Marseille Université : la plus grande université francophone du monde, 80 000 étudiants, médecine, droit, logement, communauté maghrébine. Guide complet.',
    ogDescription: 'Aix-Marseille Université, plus grande université francophone — guide pratique pour les étudiants marocains et africains : intégration, budget, campus dispersés et vie méditerranéenne.',
  },
  'universite-cote-azur': {
    title: "Université Côte d'Azur : guide étudiant étranger 2026 | Dalili",
    description: "Guide complet pour étudier à l'Université Côte d'Azur à Nice : label IdEx, Sophia Antipolis, frais d'inscription, logement, budget 750-1200€/mois, stages tech. Guide pour étudiants marocains et algériens.",
    ogDescription: "UCA Nice, label IdEx et Sophia Antipolis à 20 min — guide pratique pour les étudiants maghrébins : admission Campus France, frais, logement tendu et accès aux entreprises tech.",
  },
  'universite-rennes-1': {
    title: 'Université de Rennes : guide étudiant étranger 2026 | Dalili',
    description: "Guide complet pour étudier à l'Université de Rennes : capitale française de la cybersécurité, label Bienvenue en France ⭐⭐⭐, budget 600-950€/mois, IRISA, Orange Cyberdefense. Guide pour étudiants maghrébins.",
    ogDescription: "Université de Rennes, capital française de la cybersécurité — guide pratique : IRISA, Thales, Orange Cyberdefense, budget ultra-abordable et label Bienvenue en France ⭐⭐⭐.",
  },
  'universite-grenoble-alpes': {
    title: 'Université Grenoble Alpes : guide étudiant étranger 2026 | Dalili',
    description: "Guide complet pour étudier à l'Université Grenoble Alpes : label IdEx, campus ILL/ESRF/CEA uniques en Europe, Schneider Electric, STMicro, Alpes à 30 min. Budget 620-1000€/mois. Guide pour étudiants maghrébins.",
    ogDescription: "UGA Grenoble, le campus scientifique le plus équipé d&apos;Europe (ILL, ESRF, CEA) — guide pratique pour les étudiants en physique, ingénierie et IA qui veulent étudier en France.",
  },
  'universite-clermont-auvergne': {
    title: 'Université Clermont Auvergne : guide étudiant étranger 2026 | Dalili',
    description: "Guide complet pour étudier à l'Université Clermont Auvergne : la moins chère de France (500€/mois), label IdEx, Michelin siège mondial, logement CROUS 150€. Guide pour étudiants marocains et algériens.",
    ogDescription: "UCA Clermont, la moins chère de France — 500€/mois budget réel, label IdEx, Michelin sur le campus. Guide pratique pour les étudiants maghrébins avec un budget serré.",
  },
  'universite-bourgogne': {
    title: 'Université de Bourgogne Dijon : guide étudiant étranger 2026 | Dalili',
    description: "Guide complet pour étudier à l'Université de Bourgogne à Dijon : droit viti-vinicole unique au monde, AgroSup Dijon, budget 550-850€/mois, patrimoine UNESCO. Guide pour étudiants maghrébins.",
    ogDescription: "Université de Bourgogne, droit viti-vinicole unique en France — guide pratique : AgroSup Dijon, budget parmi les plus bas, Dijon UNESCO et 1h35 de Paris en TGV.",
  },
};

export async function generateStaticParams() {
  return getAllUniversitySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const uni = getUniversity(params.slug);
  if (!uni) return {};
  const seo = UNI_SEO[params.slug];
  const title = seo?.title ?? `${uni.name} : guide étudiant international 2026 | Dalili`;
  const description = seo?.description ?? `Tout savoir sur ${uni.name} : frais d'inscription, logement CROUS, budget mensuel à ${uni.city}, programmes et avis.`;
  const ogDescription = seo?.ogDescription ?? description;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/universites/${params.slug}` },
    openGraph: {
      title,
      description: ogDescription,
      url: `${SITE_URL}/universites/${params.slug}`,
      siteName: 'Dalili',
      type: 'article',
      images: [{ url: `${SITE_URL}${uni.thumbnail}`, width: 1200, height: 675 }],
    },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', marginBottom: 12, padding: '4px 14px', border: `1px solid rgba(${ACCENT},0.25)`, borderRadius: 100, background: `rgba(${ACCENT},0.06)` }}>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(77,143,255,0.75)` }}>{children}</span>
    </div>
  );
}

export default async function UniversityPage({ params }: { params: { slug: string } }) {
  const uni = getUniversity(params.slug);
  if (!uni) notFound();

  // Load MDX long-form content if available
  const mdxPath = path.join(process.cwd(), 'content', 'universites', `${params.slug}.mdx`);
  let mdxContent: React.ReactElement | null = null;
  let faqItems: { question: string; answer: string }[] = [];

  if (fs.existsSync(mdxPath)) {
    const raw = fs.readFileSync(mdxPath, 'utf8');
    faqItems = extractFaqItems(raw);
    const { content } = await compileMDX({
      source: raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components: mdxComponents as any,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      },
    });
    mdxContent = content;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
      { '@type': 'ListItem', position: 3, name: uni.name, item: `${SITE_URL}/universites/${uni.slug}` },
    ],
  };

  const eduSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: uni.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: uni.city,
      addressRegion: uni.region,
      addressCountry: 'FR',
    },
    url: uni.websiteUrl,
    numberOfStudents: uni.students,
    image: `${SITE_URL}${uni.thumbnail}`,
    description: UNI_SEO[params.slug]?.description ?? `Guide pour étudier à ${uni.name}`,
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${uni.name} : guide complet étudiant étranger 2026`,
    description: UNI_SEO[params.slug]?.description ?? `Guide pour étudier à ${uni.name}`,
    image: `${SITE_URL}${uni.thumbnail}`,
    author: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-06-18',
    mainEntityOfPage: `${SITE_URL}/universites/${params.slug}`,
  };

  const faqSchema = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eduSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Universités', href: '/universites' }, { label: uni.name, href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: `rgb(${ACCENT})`, padding: '4px 12px', border: `1px solid rgba(${ACCENT},0.3)`, borderRadius: 100, background: `rgba(${ACCENT},0.08)` }}>{uni.city}</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>{uni.type}</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 0.9, letterSpacing: '0.03em', color: '#fff', margin: '0 0 16px' }}>
              {uni.name}
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 32px' }}>
              Guide complet pour les étudiants marocains, algériens, tunisiens et égyptiens qui souhaitent intégrer {uni.name}.
            </p>

            {/* Cover thumbnail */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(${ACCENT},0.18)`, boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}>
              <Image
                src={uni.thumbnail}
                alt={uni.name}
                fill
                sizes="(max-width:900px) 100vw, 860px"
                style={{ objectFit: 'cover' }}
                placeholder="blur"
                blurDataURL={BLUR_DATA[uni.thumbnail]}
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(1,4,16,0.4) 100%)' }} />
            </div>
          </div>

          {/* ── Informations clés ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Informations clés</SectionLabel>
            <div style={{ overflowX: 'auto', marginTop: 4 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)' }}>
                <tbody>
                  {[
                    { label: 'Ville', value: `${uni.city}, ${uni.region}` },
                    { label: 'Type', value: uni.type },
                    { label: 'Étudiants', value: `${uni.students.toLocaleString('fr-FR')}` },
                    { label: 'Étudiants internationaux', value: `~${uni.internationalStudents.toLocaleString('fr-FR')}` },
                    { label: 'Frais inscription Licence (hors exemption)', value: `${uni.tuitionLicence.toLocaleString('fr-FR')} €/an` },
                    { label: 'Frais inscription Master (hors exemption)', value: `${uni.tuitionMaster.toLocaleString('fr-FR')} €/an` },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '14px 0', fontWeight: 500, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', width: '50%', paddingRight: 16 }}>{row.label}</td>
                      <td style={{ padding: '14px 0', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Formations populaires ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Formations populaires</SectionLabel>
            <ul style={{ margin: '8px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uni.popularPrograms.map((prog, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#4d8fff', flexShrink: 0, marginTop: 2 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>{prog}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Niveau de vie étudiant ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Niveau de vie étudiant à {uni.city}</SectionLabel>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-dm-sans)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Logement CROUS', 'Studio privé', 'Transport', 'Nourriture'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {[uni.costCrous, uni.costPrivate, uni.costTransport, uni.costFood].map((val, i) => (
                      <td key={i} style={{ padding: '14px 8px', fontWeight: 600, fontSize: '0.875rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{val}</td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={4} style={{ padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
                        Budget mensuel estimé : <strong style={{ color: '#fff' }}>{uni.monthlyBudgetMin}€ – {uni.monthlyBudgetMax}€</strong> selon le logement
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Avantages / Inconvénients ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Avantages & Inconvénients</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px,100%), 1fr))', gap: 16, marginTop: 12 }}>
              <div style={{ padding: 24, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#10B981', margin: '0 0 14px' }}>✅ Avantages</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uni.pros.map((pro, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#10B981', flexShrink: 0 }}>+</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: 24, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 16 }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F43F5E', margin: '0 0 14px' }}>❌ Inconvénients</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {uni.cons.map((con, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: '#F43F5E', flexShrink: 0 }}>–</span>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Avis Dalili (résumé court de lib/universities.ts) ── */}
          <section style={{ marginBottom: 56 }}>
            <div style={{ padding: 'clamp(24px,3vw,36px)', background: 'rgba(1,77,248,0.06)', border: '1px solid rgba(77,143,255,0.2)', borderRadius: 20 }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff', margin: '0 0 16px' }}>★ Avis Dalili</p>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '1rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0 }}>{uni.avis}</p>
            </div>
          </section>

          {/* ── Long-form MDX content ── */}
          {mdxContent && (
            <section style={{ marginBottom: 56 }}>
              <div className="city-mdx-body">
                {mdxContent}
              </div>
            </section>
          )}

          {/* ── Liens officiels ── */}
          <section style={{ marginBottom: 56 }}>
            <SectionLabel>Liens officiels</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[
                { label: `Site officiel de ${uni.name}`, url: uni.websiteUrl },
                { label: 'CROUS local — logement et restauration', url: uni.crousUrl },
                { label: 'Campus France — admission internationale', url: uni.campusFranceUrl },
                { label: 'Service-Public.fr — démarches administratives', url: 'https://www.service-public.fr' },
                { label: 'ANEF — titre de séjour en ligne', url: 'https://administration-etrangers-en-france.interieur.gouv.fr' },
              ].map(link => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}>
                  <span>{link.label}</span>
                  <span style={{ color: '#4d8fff', flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          </section>

          {/* ── Related articles ── */}
          {uni.relatedArticles.length > 0 && (
            <RelatedArticles articles={uni.relatedArticles} />
          )}

          {/* Back */}
          <div style={{ marginTop: 40 }}>
            <Link href="/universites" style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>
              ← Toutes les universités
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

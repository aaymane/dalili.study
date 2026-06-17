import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'À propos de Dalili — par des étudiants, pour des étudiants | Dalili',
  description: 'Dalili (دليلي) signifie "mon guide" en arabe. Fondé par Aymane, étudiant marocain, pour que les étudiants maghrebins trouvent en France les réponses que personne ne leur donne.',
  alternates: { canonical: `${SITE_URL}/a-propos` },
  openGraph: {
    title: 'À propos de Dalili — mon guide en arabe | Dalili',
    description: 'L\'histoire derrière Dalili : Aymane, Mouad, Mouhcine — trois étudiants qui ont vécu le chaos administratif et ont décidé de créer le guide qu\'ils auraient voulu avoir.',
    url: `${SITE_URL}/a-propos`,
    siteName: 'Dalili', type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'À propos', item: `${SITE_URL}/a-propos` },
  ],
};

const founders = [
  {
    initial: 'A',
    name: 'Aymane Amri',
    role: 'Fondateur',
    flag: '🇲🇦',
    origin: 'Maroc',
    domain: 'Produit & Éditorial',
    story: 'Arrivé du Maroc sans mode d\'emploi. A navigué seul à travers OFII, CROUS, CAF et compte bancaire. DALILI est le guide qu\'il aurait voulu avoir.',
    color: '77,143,255',
  },
  {
    initial: 'M',
    name: 'Mouad',
    role: 'Co-fondateur',
    flag: '🇲🇦',
    origin: 'Maroc',
    domain: 'DevOps & IA',
    story: 'Architecte de l\'infrastructure Dalili. Automatise, optimise et construit les systèmes qui font tourner la plateforme en coulisses.',
    color: '168,85,247',
  },
  {
    initial: 'M',
    name: 'Mouhcine',
    role: 'Co-fondateur',
    flag: '🇲🇦',
    origin: 'Maroc',
    domain: 'Marketing, SEO & UX',
    story: 'Fait en sorte que les bons étudiants trouvent Dalili au bon moment. Chaque article bien classé, c\'est un étudiant qui arrive mieux préparé.',
    color: '16,185,129',
  },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh', overflow: 'hidden' }}>

        {/* Hero section */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,5vw,40px)', marginBottom: 'clamp(80px,12vw,140px)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'À propos', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* Arabic word */}
          <div style={{ marginBottom: 24 }}>
            <span style={{
              fontFamily: 'serif',
              fontSize: 'clamp(3rem,8vw,5rem)',
              color: 'rgba(1,77,248,0.25)',
              letterSpacing: '0.05em',
              direction: 'rtl',
              display: 'block',
              lineHeight: 1,
            }}>دليلي</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(3.5rem,10vw,8rem)',
            lineHeight: 0.88,
            letterSpacing: '0.04em',
            color: '#fff',
            margin: '0 0 clamp(20px,3vw,32px)',
          }}>
            DALILI<br />
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>MON GUIDE.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 'clamp(1rem,1.5vw,1.15rem)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.85,
            margin: 0,
            maxWidth: 560,
          }}>
            En arabe, <em style={{ fontStyle: 'normal', color: 'rgba(255,255,255,0.8)' }}>dalili</em> (دليلي) signifie{' '}
            <em style={{ fontStyle: 'normal', color: '#4d8fff' }}>mon guide</em>. Pas un guide générique.{' '}
            <strong style={{ fontWeight: 600, color: '#fff' }}>Le tien</strong>.
          </p>
        </div>

        {/* Story section */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,5vw,40px)', marginBottom: 'clamp(80px,12vw,120px)' }}>
          <div style={{ display: 'inline-flex', marginBottom: 32, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>L&apos;origine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              'Aymane arrive en France depuis le Maroc. Comme des milliers d\'étudiants maghrébins chaque année, il a un dossier Campus France, un visa, une admission — et aucune idée de ce qui l\'attend vraiment.',
              'OFII à valider dans les 3 mois, compte bancaire impossible à ouvrir sans justificatif de domicile, CROUS qui demande une attestation que personne ne lui a dit d\'avoir, CAF qui ne répond pas, Ameli qui ne le retrouve pas dans le système.',
              'Les forums Facebook ne donnent que des avis contradictoires. Campus France explique la procédure officielle, pas la réalité. L\'Étudiant parle à des étudiants qui connaissent déjà le système. Studyrama est fait pour les lycéens français.',
              'Personne ne lui parle, à lui : l\'étudiant marocain, algérien, tunisien, égyptien, qui arrive avec un bagage différent, des documents différents, des délais différents.',
              'Dalili est né de cette frustration. Avec Mouad et Mouhcine, Aymane a décidé de construire le guide qu\'ils auraient voulu avoir — précis, honnête, basé sur du vécu.',
            ].map((para, i) => (
              <p key={i} style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: i === 3 ? 500 : 300,
                fontSize: 'clamp(0.9rem,1.3vw,1rem)',
                color: i === 3 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                lineHeight: 1.85,
                margin: 0,
                borderLeft: i === 3 ? '2px solid rgba(77,143,255,0.4)' : 'none',
                paddingLeft: i === 3 ? 16 : 0,
              } as React.CSSProperties}>{para}</p>
            ))}
          </div>
        </div>

        {/* Founders */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,5vw,60px)', marginBottom: 'clamp(80px,12vw,120px)' }}>
          <div style={{ display: 'inline-flex', marginBottom: 40, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>L&apos;équipe</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: 'clamp(14px,2.5vw,20px)' }}>
            {founders.map(f => (
              <div key={f.name} style={{
                padding: 'clamp(24px,3vw,32px)',
                background: `linear-gradient(145deg, rgba(${f.color},0.06) 0%, rgba(1,4,16,0.97) 65%)`,
                border: `1px solid rgba(${f.color},0.15)`,
                borderRadius: 20,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, rgba(${f.color},0.6), transparent)` }} />

                {/* Avatar initial */}
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: `rgba(${f.color},0.12)`,
                  border: `1px solid rgba(${f.color},0.25)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1.6rem',
                  color: `rgb(${f.color})`,
                  marginBottom: 20,
                  letterSpacing: '0.04em',
                }}>{f.initial}</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '1rem' }}>{f.flag}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{f.origin}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.5rem,2.5vw,1.9rem)', lineHeight: 0.95, letterSpacing: '0.03em', color: '#fff', margin: '0 0 6px' }}>{f.name}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgb(${f.color})`, padding: '3px 9px', border: `1px solid rgba(${f.color},0.28)`, borderRadius: 100, background: `rgba(${f.color},0.08)` }}>{f.role}</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.48rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', padding: '3px 9px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100 }}>{f.domain}</span>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{f.story}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,5vw,40px)', marginBottom: 'clamp(80px,12vw,120px)' }}>
          <div style={{ display: 'inline-flex', marginBottom: 32, padding: '4px 14px', border: '1px solid rgba(77,143,255,0.22)', borderRadius: 100, background: 'rgba(77,143,255,0.05)' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)' }}>Notre mission</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%), 1fr))', gap: 16 }}>
            {[
              {
                label: 'Sourcé',
                text: 'Chaque information est vérifiée sur les sources officielles (Campus France, Service-Public, CROUS). Nous citons nos sources.',
                color: '77,143,255',
              },
              {
                label: 'Honnête',
                text: 'Délais réels, difficultés réelles. Nous ne répétons pas la version officielle quand elle ne correspond pas à la réalité terrain.',
                color: '16,185,129',
              },
              {
                label: 'Spécifique',
                text: 'Pour les étudiants marocains, algériens, tunisiens et égyptiens — pas un guide générique pour tous les étudiants internationaux.',
                color: '245,158,11',
              },
              {
                label: 'Gratuit',
                text: 'Dalili est et restera gratuit. L\'information administrative ne devrait pas être réservée à ceux qui peuvent payer un accompagnement.',
                color: '168,85,247',
              },
            ].map(item => (
              <div key={item.label} style={{
                padding: '24px 20px',
                background: `rgba(${item.color},0.04)`,
                border: `1px solid rgba(${item.color},0.12)`,
                borderRadius: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: '1.8rem', letterSpacing: '0.06em', color: `rgb(${item.color})`, marginBottom: 10 }}>{item.label}</div>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,5vw,40px)' }}>
          <div style={{
            padding: 'clamp(32px,5vw,56px)',
            background: 'linear-gradient(135deg, rgba(1,77,248,0.08) 0%, rgba(1,4,16,0.95) 60%)',
            border: '1px solid rgba(1,77,248,0.2)',
            borderRadius: 24,
            textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px' }}>
              COMMENCER<br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>AVEC DALILI.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, margin: '0 0 32px' }}>
              Explorez nos guides, choisissez votre ville et préparez votre arrivée — sans mauvaises surprises.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/guides" style={{
                display: 'inline-block',
                padding: '13px 28px',
                background: '#014df8',
                color: '#fff',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: 100,
                textDecoration: 'none',
              }}>Voir les guides</Link>
              <Link href="/blog" style={{
                display: 'inline-block',
                padding: '13px 28px',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
              }}>Lire le blog</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

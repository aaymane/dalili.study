import type { Metadata } from 'next';
import Link from 'next/link';
import OpenAssistantButton from '@/components/OpenAssistantButton';

const SITE_URL = 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Assistant IA études France : visa, CAF, compte bloqué, TCF',
  description:
    "Assistant IA gratuit, sans inscription, en français, arabe et darija. Il répond à tes questions sur le visa étudiant, le compte bloqué, la CAF, le TCF et le logement à partir de nos guides vérifiés.",
  alternates: { canonical: `${SITE_URL}/assistant` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Assistant IA études France — gratuit, sans inscription',
    description:
      'Pose tes questions sur le visa, le compte bloqué, la CAF, le TCF ou le logement en français, arabe ou darija. Réponses basées uniquement sur nos guides vérifiés.',
    url: `${SITE_URL}/assistant`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Assistant IA', item: `${SITE_URL}/assistant` },
  ],
};

const TOPICS = [
  'Compte bloqué / AVI : montant, prestataires, transition 2026',
  'Visa étudiant et Campus France, pays par pays',
  'CAF et aide au logement (APL) pour étudiants étrangers',
  'TCF / DELF : scores requis, préparation',
  'Logement CROUS, garant, colocation',
  'Ouvrir un compte bancaire sans justificatif de domicile',
  'Carte de séjour, validation OFII, sécurité sociale',
  'Budget mensuel réel selon la ville',
];

const FAQ_ITEMS = [
  {
    q: "L'assistant IA Dalili est-il vraiment gratuit ?",
    a: "Oui. Il est gratuit et ne demande aucune inscription ni email — tu poses ta question directement depuis n'importe quelle page du site.",
  },
  {
    q: 'Dans quelles langues puis-je lui parler ?',
    a: "En français, en arabe standard, en darija (arabe dialectal maghrébin) ou en anglais. L'assistant détecte la langue de ta question et répond dans cette même langue.",
  },
  {
    q: 'Sur quoi se base-t-il pour répondre ?',
    a: "Uniquement sur les guides vérifiés publiés sur Dalili — visa, compte bloqué, CAF, logement, TCF, banque, etc. Il ne va pas chercher d'information ailleurs et ne complète pas avec des connaissances générales.",
  },
  {
    q: "Que se passe-t-il s'il ne connaît pas la réponse ?",
    a: "Il te le dit clairement plutôt que d'inventer un chiffre ou une procédure. C'est une règle stricte : si l'information n'est pas dans nos guides, il ne répond pas au hasard.",
  },
  {
    q: 'Remplace-t-il un avocat, un consulat ou un conseiller Campus France ?',
    a: "Non. Ce n'est pas un conseil juridique ou médical. Pour les situations complexes ou atypiques (refus de visa, contentieux, cas particulier), consulte un professionnel qualifié ou le service concerné — l'assistant t'oriente vers nos guides, il ne remplace pas une décision officielle.",
  },
  {
    q: 'Comment vérifier une information donnée par l’assistant ?',
    a: "Chaque réponse s'accompagne des articles Dalili utilisés pour la construire, avec un lien direct. Pour les montants et délais critiques, vérifie toujours la source officielle citée dans l'article avant de décider.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const ctaButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  padding: '15px 28px',
  background: 'linear-gradient(135deg, #014df8 0%, #4d8fff 100%)',
  border: 'none',
  borderRadius: 12,
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: '0.82rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 8px 28px rgba(1,77,248,0.35)',
};

export default function AssistantPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div style={{ background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(24px,4vw,40px)' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
              Accueil
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.6rem' }}>›</span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4d8fff' }}>
              Assistant IA
            </span>
          </nav>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.75)', marginBottom: 14 }}>
            Gratuit · Sans inscription · Français, arabe, darija
          </p>

          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: '#ffffff', margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            L&apos;assistant IA Dalili pour tes démarches en France
          </h1>

          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 680 }}>
            {"Pose ta question sur le visa, le compte bloqué, la CAF, le TCF ou le logement — en français, en arabe ou en darija. L'assistant cherche dans nos guides vérifiés et te répond à partir de ce qu'il y trouve, avec les sources citées. Gratuit, sans inscription, disponible sur chaque page du site."}
          </p>

          <OpenAssistantButton style={ctaButtonStyle}>
            Ouvrir l&apos;assistant
          </OpenAssistantButton>

          {/* Ce qu'il peut t'aider à comprendre */}
          <div style={{ marginTop: 'clamp(56px,8vw,80px)', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', color: '#ffffff', margin: '0 0 20px' }}>
              Ce qu&apos;il peut t&apos;aider à comprendre
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px 32px' }}>
              {TOPICS.map(topic => (
                <div key={topic} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
                  <span style={{ color: '#4d8fff', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment ça marche — honnêteté sur le fonctionnement réel */}
          <div style={{ marginTop: 'clamp(56px,8vw,80px)', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', color: '#ffffff', margin: '0 0 20px' }}>
              Comment ça marche, honnêtement
            </h2>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 680 }}>
              {"L'assistant ne répond pas au hasard et n'invente pas d'information. Il cherche uniquement dans les guides déjà publiés et vérifiés sur Dalili, et construit sa réponse à partir de ce qu'il y trouve. Chaque réponse indique les articles utilisés, avec un lien direct pour vérifier."}
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: 0, maxWidth: 680 }}>
              {"Si l'information demandée n'est pas dans nos guides, il te le dit clairement plutôt que d'improviser. Et ce n'est pas un conseil juridique : pour un cas complexe ou atypique, un avocat, un consulat ou un conseiller Campus France reste la bonne adresse."}
            </p>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 'clamp(56px,8vw,80px)', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', color: '#ffffff', margin: '0 0 32px' }}>
              Questions fréquentes
            </h2>
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '16px', color: '#ffffff', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {item.q}
                </h3>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{ marginTop: 'clamp(56px,8vw,80px)', padding: 'clamp(24px,4vw,44px)', background: 'linear-gradient(135deg, rgba(1,77,248,0.08) 0%, rgba(1,5,16,0.98) 60%)', border: '1px solid rgba(1,77,248,0.18)', borderRadius: 20, textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 'clamp(16px,1.5vw,18px)', color: '#ffffff', margin: '0 0 8px' }}>
              Une question sur tes démarches ?
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 24px' }}>
              Gratuit, sans inscription, en français, arabe ou darija.
            </p>
            <OpenAssistantButton style={ctaButtonStyle}>
              Ouvrir l&apos;assistant
            </OpenAssistantButton>
          </div>

        </div>
      </div>
    </>
  );
}
